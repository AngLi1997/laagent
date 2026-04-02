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

marked.setOptions({
    breaks: true,
    gfm: true
});

if (window.hljs) {
    window.hljs.configure({
        ignoreUnescapedHTML: true
    });
}

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
    const unsafeHtml = marked.parse(normalizedMarkdown);
    return DOMPurify.sanitize(unsafeHtml);
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

function enhanceCodeBlocks(container) {
    const codeBlocks = container.querySelectorAll("pre > code");

    codeBlocks.forEach((codeEl) => {
        if (window.hljs && !codeEl.dataset.highlighted) {
            window.hljs.highlightElement(codeEl);
            codeEl.dataset.highlighted = "true";
        }

        const preEl = codeEl.parentElement;
        if (!preEl || preEl.parentElement?.classList.contains("code-block")) {
            return;
        }

        const blockEl = document.createElement("div");
        blockEl.className = "code-block";

        const headerEl = document.createElement("div");
        headerEl.className = "code-block-header";

        const languageEl = document.createElement("span");
        languageEl.className = "code-block-language";
        languageEl.textContent = detectCodeLanguage(codeEl);

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
                dataLines.push(line.slice(5).trimStart());
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
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
