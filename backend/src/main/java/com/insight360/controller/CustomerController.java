package com.insight360.controller;

import com.insight360.entity.Customer;
import com.insight360.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class CustomerController {

    private final CustomerRepository customerRepository;

    /**
     * Creates a new customer record.
     *
     * @param customer The customer details.
     * @return The persisted customer entity.
     */
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        log.info("Request received to create customer: {}", customer.getEmail());
        Customer savedCustomer = customerRepository.save(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
    }

    /**
     * Retrieves customer details by ID.
     *
     * @param id The customer database ID.
     * @return The customer record if found, or 404 NOT FOUND.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        log.info("Request received to fetch customer details for ID: {}", id);
        return customerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    log.warn("Customer details not found for ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
}
