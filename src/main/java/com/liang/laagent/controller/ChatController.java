package com.liang.laagent.controller;

import com.liang.laagent.service.Assistant;
import dev.langchain4j.model.chat.ChatModel;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
public class ChatController {

    @Resource
    private Assistant assistant;

    @GetMapping("/chat")
    public Flux<String> chat(@RequestParam("message") String message) {
        return assistant.chat(message);
    }
}
