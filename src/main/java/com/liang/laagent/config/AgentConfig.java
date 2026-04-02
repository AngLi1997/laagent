package com.liang.laagent.config;

import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.store.memory.chat.InMemoryChatMemoryStore;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AgentConfig {

    @Bean
    public ChatMemoryProvider chatMemoryProvider() {
        InMemoryChatMemoryStore inMemoryChatMemoryStore = new InMemoryChatMemoryStore();
        return memoryId -> MessageWindowChatMemory.builder()
                .id(memoryId)
                .maxMessages(10)
                .chatMemoryStore(inMemoryChatMemoryStore)
                .build();
    }
}
