package com.insight360.controller;

import com.insight360.document.CustomerAction;
import com.insight360.service.EventProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EventController {

    private final EventProducer eventProducer;

    /**
     * Simulation endpoint to publish a customer event logs payload.
     *
     * @param action The customer event action details.
     * @return Confirmation status of payload ingestion.
     */
    @PostMapping
    public ResponseEntity<String> simulateEvent(@RequestBody CustomerAction action) {
        log.info("Request received to simulate customer action event.");

        // Automatically assign uuid values and current time if not provided
        if (action.getEventId() == null) {
            action.setEventId(UUID.randomUUID().toString());
        }
        if (action.getTimestamp() == null) {
            action.setTimestamp(LocalDateTime.now());
        }

        eventProducer.sendEvent(action);
        return ResponseEntity.ok("Event sent to streaming pipeline with ID: " + action.getEventId());
    }
}
