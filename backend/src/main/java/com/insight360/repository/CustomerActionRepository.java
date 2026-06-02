package com.insight360.repository;

import com.insight360.document.CustomerAction;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerActionRepository extends ElasticsearchRepository<CustomerAction, String> {
    List<CustomerAction> findByCustomerId(Long customerId);
}
