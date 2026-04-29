package com.quotation.system.infrastructure.persistence.mapper;

import com.quotation.system.domain.model.Product;
import com.quotation.system.infrastructure.persistence.entity.ProductEntity;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductPersistenceMapper {
    ProductEntity toEntity(Product domain);
    Product toDomain(ProductEntity entity);
    List<Product> toDomainList(List<ProductEntity> entities);
}
