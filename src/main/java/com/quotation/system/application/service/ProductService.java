package com.quotation.system.application.service;

import com.quotation.system.application.dto.ProductDTO;
import com.quotation.system.application.mapper.ProductMapper;
import com.quotation.system.domain.model.Product;
import com.quotation.system.domain.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductDTO create(ProductDTO productDTO) {
        Product product = productMapper.toDomain(productDTO);
        return productMapper.toDto(productRepository.save(product));
    }

    public ProductDTO update(Long id, ProductDTO productDTO) {
        return productRepository.findById(id)
                .map(existing -> {
                    Product updated = productMapper.toDomain(productDTO);
                    updated.setId(id);
                    return productMapper.toDto(productRepository.save(updated));
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> findAll() {
        return productMapper.toDtoList(productRepository.findAll());
    }

    @Transactional(readOnly = true)
    public ProductDTO findById(Long id) {
        return productRepository.findById(id)
                .map(productMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}
