package com.insight360.service;

import com.insight360.document.CustomerAction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
public class SseService {

    // Thread-safe list of active emitters
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    /**
     * Registers a new Server-Sent Events client connection.
     *
     * @return The registered SseEmitter instance.
     */
    public SseEmitter register() {
        // Create emitter with 30 minutes timeout (1,800,000 milliseconds)
        SseEmitter emitter = new SseEmitter(1800000L);

        // Remove from list on completion, timeout, or error
        emitter.onCompletion(() -> {
            log.info("SSE connection completed. Removing client emitter.");
            emitters.remove(emitter);
        });

        emitter.onTimeout(() -> {
            log.warn("SSE connection timed out. Removing client emitter.");
            emitters.remove(emitter);
        });

        emitter.onError((ex) -> {
            log.error("SSE connection error: {}. Removing client emitter.", ex.getMessage());
            emitters.remove(emitter);
        });

        // Send initial connection message to establish SSE link
        try {
            emitter.send(SseEmitter.event()
                    .name("INIT")
                    .data("Connection established successfully"));
        } catch (IOException e) {
            log.error("Failed to send initial SSE INIT event. Removing emitter.", e);
            emitters.remove(emitter);
            return emitter;
        }

        emitters.add(emitter);
        log.info("Registered new SSE client emitter. Active count: {}", emitters.size());
        return emitter;
    }

    /**
     * Broadcasts a CustomerAction event to all registered and active client connections.
     *
     * @param action The customer event payload to stream.
     */
    public void broadcast(CustomerAction action) {
        if (emitters.isEmpty()) {
            return;
        }

        log.info("Broadcasting CustomerAction event to {} active SSE clients. eventId: {}", 
                emitters.size(), action.getEventId());

        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("CUSTOMER_EVENT")
                        .data(action));
            } catch (IOException e) {
                log.warn("Failed to send SSE event to client. Marking client for removal.", e);
                deadEmitters.add(emitter);
            }
        }

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
            log.info("Cleaned up {} dead SSE connections. Remaining active clients: {}", 
                    deadEmitters.size(), emitters.size());
        }
    }
}
