package com.insight360.controller;

import com.insight360.service.SseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/stream")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class StreamController {

    private final SseService sseService;

    /**
     * Exposes a real-time Server-Sent Events stream of incoming customer events.
     *
     * @return SseEmitter linked to client broadcaster.
     */
    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamEvents() {
        log.info("Client requested Server-Sent Events live stream connection.");
        return sseService.register();
    }
}
