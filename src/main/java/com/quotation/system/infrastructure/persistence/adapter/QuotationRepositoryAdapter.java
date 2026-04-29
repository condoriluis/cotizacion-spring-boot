package com.quotation.system.infrastructure.persistence.adapter;

import com.quotation.system.domain.model.Quotation;
import com.quotation.system.domain.model.QuotationItem;
import com.quotation.system.domain.repository.QuotationRepository;
import com.quotation.system.infrastructure.persistence.entity.ClientEntity;
import com.quotation.system.infrastructure.persistence.entity.ProductEntity;
import com.quotation.system.infrastructure.persistence.entity.QuotationEntity;
import com.quotation.system.infrastructure.persistence.entity.QuotationItemEntity;
import com.quotation.system.infrastructure.persistence.repository.ClientJpaRepository;
import com.quotation.system.infrastructure.persistence.repository.ProductJpaRepository;
import com.quotation.system.infrastructure.persistence.repository.QuotationJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class QuotationRepositoryAdapter implements QuotationRepository {

    private final QuotationJpaRepository quotationJpaRepository;
    private final ClientJpaRepository clientJpaRepository;
    private final ProductJpaRepository productJpaRepository;

    @Override
    public Quotation save(Quotation quotation) {
        ClientEntity client = clientJpaRepository.findById(quotation.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        QuotationEntity entity = QuotationEntity.builder()
                .id(quotation.getId())
                .client(client)
                .fecha(quotation.getFecha())
                .estado(quotation.getEstado())
                .total(quotation.getTotal())
                .build();

        List<QuotationItemEntity> items = quotation.getItems().stream()
                .map(item -> {
                    ProductEntity product = productJpaRepository.findById(item.getProductId())
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                    
                    return QuotationItemEntity.builder()
                            .id(item.getId())
                            .quotation(entity)
                            .product(product)
                            .cantidad(item.getCantidad())
                            .precioUnitario(item.getPrecioUnitario())
                            .subtotal(item.getSubtotal())
                            .build();
                }).collect(Collectors.toList());

        entity.setItems(items);

        QuotationEntity saved = quotationJpaRepository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<Quotation> findById(Long id) {
        return quotationJpaRepository.findById(id).map(this::mapToDomain);
    }

    @Override
    public List<Quotation> findAll() {
        return quotationJpaRepository.findAll().stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsById(Long id) {
        return quotationJpaRepository.existsById(id);
    }

    @Override
    public void deleteById(Long id) {
        quotationJpaRepository.deleteById(id);
    }

    private Quotation mapToDomain(QuotationEntity entity) {
        return Quotation.builder()
                .id(entity.getId())
                .clienteId(entity.getClient().getId())
                .clientNombre(entity.getClient().getNombre())
                .fecha(entity.getFecha())
                .estado(entity.getEstado())
                .total(entity.getTotal())
                .items(entity.getItems().stream()
                        .map(item -> QuotationItem.builder()
                                .id(item.getId())
                                .productId(item.getProduct().getId())
                                .productNombre(item.getProduct().getNombre())
                                .cantidad(item.getCantidad())
                                .precioUnitario(item.getPrecioUnitario())
                                .subtotal(item.getSubtotal())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
