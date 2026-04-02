package com.liang.laagent.controller;

import com.liang.laagent.service.Assistant;
import jakarta.annotation.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
public class ChatController {

    @Resource
    private Assistant assistant;

    @GetMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> chat(@RequestParam String memoryId, @RequestParam("message") String message) {
        return assistant.chat(memoryId, message)
                .doFirst(()->{
                    System.out.println("========开始输出========");
                })
                .doOnNext(System.out::println)
                .doOnComplete(()->{
                    System.out.println("========输出完成========");
                })
                .doOnError(e->{
                    System.out.println("========输出错误开始========");
                    System.out.println(e.getLocalizedMessage());
                    System.out.println("========输出错误结束========");
                });
    }
}
