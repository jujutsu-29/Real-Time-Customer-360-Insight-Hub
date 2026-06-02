package com.insight360.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.insight360.document.CustomerAction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Publishes a CustomerAction event to the customer-events Kafka topic.
     *
     * @param action The customer action payload to stream.
     */
    public void sendEvent(CustomerAction action) {
        try {
            String payload = objectMapper.writeValueAsString(action);
            log.info("Publishing event to customer-events topic: eventId={}, customerId={}", 
                    action.getEventId(), action.getCustomerId());
            kafkaTemplate.send("customer-events", action.getEventId(), payload);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize CustomerAction payload for eventId: " + action.getEventId(), e);
        }
    }
}
