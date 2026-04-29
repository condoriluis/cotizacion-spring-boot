package com.quotation.system.infrastructure.persistence.repository;

import com.quotation.system.infrastructure.persistence.entity.QuotationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuotationJpaRepository extends JpaRepository<QuotationEntity, Long> {
}
