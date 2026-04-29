package com.quotation.system.infrastructure.persistence.adapter;

import com.quotation.system.domain.model.Product;
import com.quotation.system.domain.repository.ProductRepository;
import com.quotation.system.infrastructure.persistence.mapper.ProductPersistenceMapper;
import com.quotation.system.infrastructure.persistence.repository.ProductJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ProductRepositoryAdapter implements ProductRepository {

    private final ProductJpaRepository productJpaRepository;
    private final ProductPersistenceMapper productPersistenceMapper;

    @Override
    public Product save(Product product) {
        return productPersistenceMapper.toDomain(
                productJpaRepository.save(productPersistenceMapper.toEntity(product))
        );
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productJpaRepository.findById(id)
                .map(productPersistenceMapper::toDomain);
    }

    @Override
    public List<Product> findAll() {
        return productPersistenceMapper.toDomainList(productJpaRepository.findAll());
    }

    @Override
    public void deleteById(Long id) {
        productJpaRepository.deleteById(id);
    }
}
