package com.quotation.system.infrastructure.persistence.repository;

import com.quotation.system.infrastructure.persistence.entity.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientJpaRepository extends JpaRepository<ClientEntity, Long> {
}
