package com.quotation.system.infrastructure.persistence.repository;

import com.quotation.system.infrastructure.persistence.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductJpaRepository extends JpaRepository<ProductEntity, Long> {
}
