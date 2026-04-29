package com.quotation.system.application.mapper;

import com.quotation.system.application.dto.ProductDTO;
import com.quotation.system.domain.model.Product;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductDTO toDto(Product product);
    Product toDomain(ProductDTO productDTO);
    List<ProductDTO> toDtoList(List<Product> products);
}
