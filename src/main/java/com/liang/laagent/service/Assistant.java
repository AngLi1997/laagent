package com.liang.laagent.service;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;
import dev.langchain4j.service.spring.AiServiceWiringMode;
import reactor.core.publisher.Flux;

@AiService(
        wiringMode = AiServiceWiringMode.EXPLICIT,
        streamingChatModel = "ollamaStreamingChatModel",
        chatMemoryProvider = "chatMemoryProvider"
)
public interface Assistant {

    @SystemMessage("你是一个专业的智能人工助手，名字叫`编号89757`")
    Flux<String> chat(@MemoryId String memoryId, @UserMessage String message);
}
