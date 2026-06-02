package com.insight360.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.insight360.document.CustomerAction;
import com.insight360.repository.CustomerActionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventConsumer {

    private final CustomerActionRepository customerActionRepository;
    private final ObjectMapper objectMapper;

    // In-memory cache holding the latest event per customer (customerId -> CustomerAction) for frontend polling/broadcasting.
    private final Map<Long, CustomerAction> latestEvents = new ConcurrentHashMap<>();

    /**
     * Listens to customer-events Kafka topic, deserializes message, index to Elasticsearch and caches the latest event.
     *
     * @param message The serialized Kafka event string.
     */
    @KafkaListener(topics = "customer-events", groupId = "insight360-group")
    public void consume(String message) {
        log.info("Received message from customer-events Kafka topic: {}", message);
        try {
            CustomerAction action = objectMapper.readValue(message, CustomerAction.class);

            // Persist the action log into Elasticsearch
            CustomerAction savedAction = customerActionRepository.save(action);
            log.info("Successfully indexed CustomerAction to Elasticsearch. ID: {}", savedAction.getEventId());

            // Temporarily store the latest event in thread-safe memory
            if (action.getCustomerId() != null) {
                latestEvents.put(action.getCustomerId(), action);
                log.debug("Cached latest event in ConcurrentHashMap for customerId: {}", action.getCustomerId());
            }
        } catch (Exception e) {
            log.error("Failed to deserialize and process Kafka message payload: " + message, e);
        }
    }

    /**
     * Retrieve a thread-safe map of all latest events cached.
     *
     * @return Map of customerId -> CustomerAction
     */
    public Map<Long, CustomerAction> getLatestEvents() {
        return latestEvents;
    }

    /**
     * Retrieve the latest cached event for a specific customer.
     *
     * @param customerId The ID of the customer.
     * @return The latest CustomerAction event log, or null if none cached.
     */
    public CustomerAction getLatestEventForCustomer(Long customerId) {
        return latestEvents.get(customerId);
    }
}
