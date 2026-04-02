const messagesEl = document.getElementById("messages");
const memoryIdLabelEl = document.getElementById("memoryIdLabel");
const statusLabelEl = document.getElementById("statusLabel");
const streamHintEl = document.getElementById("streamHint");
const messageInputEl = document.getElementById("messageInput");
const sendButtonEl = document.getElementById("sendButton");
const stopButtonEl = document.getElementById("stopButton");
const clearButtonEl = document.getElementById("clearButton");
const newChatButtonEl = document.getElementById("newChatButton");
const scrollToBottomButtonEl = document.getElementById("scrollToBottomButton");

let memoryId = createMemoryId();
let currentAbortController = null;
let streamingMessageEl = null;
let shouldAutoScroll = true;

memoryIdLabelEl.textContent = memoryId;

const md = window.markdownit({
    breaks: true,
    linkify: true,
    typographer: false,
    highlight: function(code, lang) {
        const language = normalizeCodeLanguage(lang, code);
        if (window.hljs) {
            if (language && window.hljs.getLanguage(language)) {
                try {
                    return window.hljs.highlight(code, { language, ignoreIllegals: true }).value;
                } catch (_) {}
            }
            try {
                return window.hljs.highlightAuto(code).value;
            } catch (_) {}
        }
        return renderFallbackHighlight(code, language);
    }
});

function normalizeMarkdown(markdown) {
    if (!markdown) {
        return "";
    }

    return markdown
        .replace(/\r\n?/g, "\n")
        .replace(/([^\n])(\#{1,6}\s)/g, "$1\n\n$2")
        .replace(/(^|\n)(\#{1,6})([^\s#])/g, "$1$2 $3")
        .replace(/([：:])\s+([*-]\s+)/g, "$1\n$2")
        .replace(/([。！？；])\s+([*-]\s+)/g, "$1\n\n$2")
        .replace(/([^\n])((?:\n)?\d+\.\s)/g, "$1\n$2")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function createMemoryId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }
    return "chat-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function setStatus(text) {
    statusLabelEl.textContent = text;
}

function setStreaming(active) {
    sendButtonEl.disabled = active;
    stopButtonEl.disabled = !active;
    newChatButtonEl.disabled = active;
    streamHintEl.textContent = active ? "正在接收回复" : "等待输入";
}

function renderMarkdown(markdown) {
    const normalizedMarkdown = normalizeMarkdown(markdown);
    const unsafeHtml = md.render(normalizedMarkdown);
    return DOMPurify.sanitize(unsafeHtml, {
        ADD_ATTR: ['class'],
        FORCE_BODY: false
    });
}

function hideEmptyState() {
    const emptyStateEl = document.getElementById("emptyState");
    if (emptyStateEl) {
        emptyStateEl.style.display = "none";
    }
}

function isNearBottom() {
    const distance = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight;
    return distance <= 40;
}

function updateScrollState() {
    shouldAutoScroll = isNearBottom();
    scrollToBottomButtonEl.hidden = shouldAutoScroll;
}

function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
    shouldAutoScroll = true;
    scrollToBottomButtonEl.hidden = true;
}

function maybeScrollToBottom(force = false) {
    if (force || shouldAutoScroll) {
        scrollToBottom();
    }
}

function detectCodeLanguage(codeEl) {
    const className = codeEl.className || "";
    const matched = className.match(/language-([\w-]+)/i) || className.match(/lang-([\w-]+)/i);
    if (matched) {
        return matched[1];
    }
    return "code";
}

function escapeHtml(text) {
    return (text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function normalizeCodeLanguage(language, code) {
    const normalized = (language || "").toLowerCase();
    const aliases = {
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "typescript",
        yml: "yaml",
        sh: "bash",
        shell: "bash",
        zsh: "bash",
        html: "xml",
        vue: "xml",
        py: "python",
        python3: "python",
        plaintext: "text",
        plain: "text",
        code: inferCodeLanguage(code)
    };

    return aliases[normalized] || normalized || inferCodeLanguage(code);
}

function inferCodeLanguage(code) {
    const text = code || "";

    if (/@\w+|public\s+class|private\s+final|implements\s+\w+|System\.out\.println/.test(text)) {
        return "java";
    }
    if (/^\s*\{[\s\S]*\}\s*$/.test(text) && /"\w+"\s*:/.test(text)) {
        return "json";
    }
    if (/<\/?[a-z][\s\S]*>/i.test(text)) {
        return "xml";
    }
    if (/\b(const|let|function|=>|console\.log)\b/.test(text)) {
        return "javascript";
    }
    if (/\b(select|insert|update|delete|from|where|join)\b/i.test(text)) {
        return "sql";
    }
    if (/^\s*(curl|npm|pnpm|yarn|git|cd|ls)\b/m.test(text) || /^#!/.test(text)) {
        return "bash";
    }
    if (/\bdef\s+\w+\s*\(|\bimport\s+\w+|\bfrom\s+\w+\s+import|print\s*\(|\bpip\s+install\b/.test(text)) {
        return "python";
    }

    return "text";
}

function applyKeywordHighlight(escapedText, keywords, className = "token-keyword") {
    if (!keywords.length) {
        return escapedText;
    }

    const pattern = new RegExp("\\b(" + keywords.join("|") + ")\\b", "gi");
    return escapedText.replace(pattern, '<span class="' + className + '">$1</span>');
}

function renderFallbackHighlight(code, language) {
    const source = code || "";
    const tokenStore = [];

    const stash = (text, regex, className) => text.replace(regex, (match) => {
        const token = "__HL_TOKEN_" + tokenStore.length + "__";
        tokenStore.push('<span class="' + className + '">' + escapeHtml(match) + "</span>");
        return token;
    });

    let content = source;

    content = stash(content, /\/\*[\s\S]*?\*\//g, "token-comment");
    content = stash(content, /\/\/.*$/gm, "token-comment");
    content = stash(content, /#.*$/gm, "token-comment");
    content = stash(content, /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g, "token-string");

    if (language === "java") {
        content = stash(content, /@\w+/g, "token-annotation");
    }

    let escaped = escapeHtml(content);

    const keywordMap = {
        java: ["package", "import", "class", "interface", "enum", "extends", "implements", "public", "private", "protected", "static", "final", "void", "new", "return", "if", "else", "for", "while", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "throws", "null", "true", "false", "this", "super", "record"],
        javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "new", "class", "extends", "import", "from", "export", "default", "async", "await", "true", "false", "null", "undefined"],
        typescript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "switch", "case", "break", "continue", "try", "catch", "finally", "throw", "new", "class", "extends", "interface", "type", "implements", "import", "from", "export", "default", "async", "await", "public", "private", "protected", "readonly", "true", "false", "null", "undefined"],
        json: ["true", "false", "null"],
        sql: ["select", "insert", "update", "delete", "from", "where", "join", "left", "right", "inner", "outer", "group", "by", "order", "limit", "as", "and", "or", "not", "into", "values", "set", "create", "table", "alter", "drop"],
        bash: ["if", "then", "else", "fi", "for", "do", "done", "case", "esac", "function", "in", "export", "local", "echo", "exit"],
        python: ["def", "class", "import", "from", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or", "is", "None", "True", "False", "try", "except", "finally", "raise", "with", "as", "pass", "break", "continue", "lambda", "yield", "global", "nonlocal", "del", "assert", "async", "await"],
        xml: []
    };

    escaped = applyKeywordHighlight(escaped, keywordMap[language] || []);
    escaped = escaped.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="token-number">$1</span>');

    if (language === "json") {
        escaped = escaped.replace(/"([^"]+)"(?=\s*:)/g, '<span class="token-property">"$1"</span>');
    }

    if (language === "xml") {
        escaped = escaped.replace(/(&lt;\/?)([\w:-]+)/g, '$1<span class="token-keyword">$2</span>');
    }

    return escaped.replace(/__HL_TOKEN_(\d+)__/g, (_, index) => tokenStore[Number(index)] || "");
}

function enhanceCodeBlocks(container) {
    const codeBlocks = container.querySelectorAll("pre > code");

    codeBlocks.forEach((codeEl) => {
        // Add hljs class if not already present (so styles apply)
        if (!codeEl.classList.contains("hljs")) {
            codeEl.classList.add("hljs");
        }

        const preEl = codeEl.parentElement;
        if (!preEl || preEl.parentElement?.classList.contains("code-block")) {
            return;
        }

        // Detect language from class name set by markdown-it (e.g. language-java)
        const rawLang = detectCodeLanguage(codeEl);
        const displayLang = normalizeCodeLanguage(rawLang, codeEl.textContent || "");

        const blockEl = document.createElement("div");
        blockEl.className = "code-block";

        const headerEl = document.createElement("div");
        headerEl.className = "code-block-header";

        const languageEl = document.createElement("span");
        languageEl.className = "code-block-language";
        languageEl.textContent = displayLang;

        const copyButtonEl = document.createElement("button");
        copyButtonEl.type = "button";
        copyButtonEl.className = "copy-code-button";
        copyButtonEl.textContent = "复制";
        copyButtonEl.dataset.copyCode = codeEl.textContent || "";

        headerEl.appendChild(languageEl);
        headerEl.appendChild(copyButtonEl);

        preEl.parentElement.insertBefore(blockEl, preEl);
        blockEl.appendChild(headerEl);
        blockEl.appendChild(preEl);
    });
}

function renderAssistantContent(targetEl, markdown) {
    targetEl.innerHTML = renderMarkdown(markdown);
    enhanceCodeBlocks(targetEl);
}

function appendMessage(role, content) {
    hideEmptyState();

    const wrapper = document.createElement("article");
    wrapper.className = "message " + role;

    const roleEl = document.createElement("span");
    roleEl.className = "message-role";
    roleEl.textContent = role === "user" ? "用户" : "助手";

    const contentEl = document.createElement("div");
    contentEl.className = "message-content";

    if (role === "assistant") {
        renderAssistantContent(contentEl, content);
    } else {
        contentEl.textContent = content;
    }

    wrapper.appendChild(roleEl);
    wrapper.appendChild(contentEl);
    messagesEl.appendChild(wrapper);
    maybeScrollToBottom(true);

    return { wrapper, contentEl };
}

function startAssistantMessage() {
    const message = appendMessage("assistant", "");
    message.wrapper.classList.add("streaming");
    streamingMessageEl = { ...message, rawText: "" };
}

function finishAssistantMessage() {
    if (!streamingMessageEl) {
        return;
    }

    streamingMessageEl.wrapper.classList.remove("streaming");
    if (!streamingMessageEl.rawText.trim()) {
        streamingMessageEl.rawText = "[未返回内容]";
        renderAssistantContent(streamingMessageEl.contentEl, streamingMessageEl.rawText);
    }
    streamingMessageEl = null;
}

function appendAssistantChunk(chunk) {
    if (!streamingMessageEl) {
        startAssistantMessage();
    }

    streamingMessageEl.rawText += chunk;
    renderAssistantContent(streamingMessageEl.contentEl, streamingMessageEl.rawText);
    maybeScrollToBottom();
}

function clearMessages() {
    messagesEl.innerHTML = "";

    const empty = document.createElement("div");
    empty.id = "emptyState";
    empty.className = "empty-state";
    empty.innerHTML = "<strong>新的会话</strong><span>输入消息开始新的上下文。</span>";
    messagesEl.appendChild(empty);
    shouldAutoScroll = true;
    scrollToBottomButtonEl.hidden = true;
}

function parseEventStreamChunk(buffer) {
    const events = [];
    const blocks = buffer.split(/\n\n/);
    const remaining = blocks.pop();

    for (const block of blocks) {
        const lines = block.split(/\n/);
        const dataLines = [];

        for (const line of lines) {
            if (line.startsWith("data:")) {
                // Spring WebFlux SSE writes "data:<content>" with no separator space,
                // so we must NOT strip anything — take the content verbatim after "data:"
                dataLines.push(line.slice(5));
            } else if (!line.startsWith(":") && line.trim()) {
                dataLines.push(line);
            }
        }

        const data = dataLines.join("\n");
        if (data) {
            events.push(data);
        }
    }

    return { events, remaining };
}

async function streamChat(message) {
    currentAbortController = new AbortController();
    setStreaming(true);
    setStatus("生成中");
    startAssistantMessage();

    const url = new URL("/chat", window.location.origin);
    url.searchParams.set("memoryId", memoryId);
    url.searchParams.set("message", message);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "text/event-stream"
            },
            signal: currentAbortController.signal
        });

        if (!response.ok) {
            throw new Error("请求失败，状态码 " + response.status);
        }

        if (!response.body) {
            throw new Error("当前浏览器不支持流式读取响应体");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }

            buffer += decoder.decode(value, { stream: true });
            const parsed = parseEventStreamChunk(buffer);
            buffer = parsed.remaining;

            if (parsed.events.length === 0 && buffer && !buffer.includes("data:")) {
                appendAssistantChunk(buffer);
                buffer = "";
                continue;
            }

            parsed.events.forEach(appendAssistantChunk);
        }

        const tail = buffer.trim();
        if (tail) {
            const parsedTail = parseEventStreamChunk(tail + "\n\n");
            if (parsedTail.events.length > 0) {
                parsedTail.events.forEach(appendAssistantChunk);
            } else {
                appendAssistantChunk(tail);
            }
        }

        setStatus("已完成");
    } catch (error) {
        if (error.name === "AbortError") {
            appendAssistantChunk("\n\n[已停止]");
            setStatus("已停止");
        } else {
            appendAssistantChunk("\n\n[发生错误] " + error.message);
            setStatus("请求失败");
        }
    } finally {
        finishAssistantMessage();
        currentAbortController = null;
        setStreaming(false);
    }
}

async function sendMessage() {
    const message = messageInputEl.value.trim();
    if (!message || currentAbortController) {
        return;
    }

    appendMessage("user", message);
    messageInputEl.value = "";
    await streamChat(message);
}

sendButtonEl.addEventListener("click", sendMessage);

messagesEl.addEventListener("scroll", updateScrollState);

messagesEl.addEventListener("click", async (event) => {
    const buttonEl = event.target.closest(".copy-code-button");
    if (!buttonEl) {
        return;
    }

    const code = buttonEl.dataset.copyCode || "";
    try {
        await navigator.clipboard.writeText(code);
        buttonEl.textContent = "已复制";
        buttonEl.classList.add("copied");
        window.setTimeout(() => {
            buttonEl.textContent = "复制";
            buttonEl.classList.remove("copied");
        }, 1200);
    } catch (error) {
        buttonEl.textContent = "复制失败";
        window.setTimeout(() => {
            buttonEl.textContent = "复制";
        }, 1200);
    }
});

scrollToBottomButtonEl.addEventListener("click", () => {
    scrollToBottom();
});

clearButtonEl.addEventListener("click", () => {
    messageInputEl.value = "";
    messageInputEl.focus();
});

stopButtonEl.addEventListener("click", () => {
    if (currentAbortController) {
        currentAbortController.abort();
    }
});

newChatButtonEl.addEventListener("click", () => {
    if (currentAbortController) {
        currentAbortController.abort();
    }

    memoryId = createMemoryId();
    memoryIdLabelEl.textContent = memoryId;
    clearMessages();
    setStatus("新会话");
    streamHintEl.textContent = "等待输入";
});

messageInputEl.addEventListener("keydown", (event) => {
    // isComposing 为 true 时说明输入法正在组字（如拼音），此时 Enter 应交给输入法处理
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        sendMessage();
    }
});
