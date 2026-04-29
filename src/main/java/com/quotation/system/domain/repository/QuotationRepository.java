package com.quotation.system.domain.repository;

import com.quotation.system.domain.model.Quotation;
import java.util.List;
import java.util.Optional;

public interface QuotationRepository {
    Quotation save(Quotation quotation);
    Optional<Quotation> findById(Long id);
    List<Quotation> findAll();
    boolean existsById(Long id);
    void deleteById(Long id);
}
