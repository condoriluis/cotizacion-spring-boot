package com.quotation.system.application.service;

import com.quotation.system.application.dto.QuotationDTO;
import com.quotation.system.application.mapper.QuotationMapper;
import com.quotation.system.domain.model.Product;
import com.quotation.system.domain.model.Quotation;
import com.quotation.system.domain.model.QuotationStatus;
import com.quotation.system.domain.repository.ClientRepository;
import com.quotation.system.domain.repository.ProductRepository;
import com.quotation.system.domain.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final ClientRepository clientRepository;
    private final ProductRepository productRepository;
    private final QuotationMapper quotationMapper;

    public QuotationDTO create(QuotationDTO quotationDTO) {
        // 1. Validar existencia de cliente
        clientRepository.findById(quotationDTO.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // 2. Convertir a dominio
        Quotation quotation = quotationMapper.toDomain(quotationDTO);
        quotation.setFecha(LocalDateTime.now());
        quotation.setEstado(QuotationStatus.PENDIENTE);

        // 3. Validar stock y asignar precios actuales
        quotation.getItems().forEach(item -> {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductId()));
            
            if (product.getStock() < item.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + product.getNombre());
            }
            
            item.setPrecioUnitario(product.getPrecio());
        });

        // 4. Calcular total (Lógica en entidad de dominio)
        quotation.calculateTotal();

        // 5. Guardar
        return quotationMapper.toDto(quotationRepository.save(quotation));
    }

    public QuotationDTO updateStatus(Long id, QuotationStatus status) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cotización no encontrada"));

        if (!quotation.isEditable() && status != QuotationStatus.ACEPTADA) {
            throw new RuntimeException("No se puede editar una cotización ya ACEPTADA");
        }

        quotation.setEstado(status);
        
        // Si se acepta, podríamos descontar el stock aquí (opcional según regla)
        if (status == QuotationStatus.ACEPTADA) {
            quotation.getItems().forEach(item -> {
                Product product = productRepository.findById(item.getProductId()).get();
                product.setStock(product.getStock() - item.getCantidad());
                productRepository.save(product);
            });
        }

        return quotationMapper.toDto(quotationRepository.save(quotation));
    }

    @Transactional(readOnly = true)
    public List<QuotationDTO> findAll() {
        return quotationMapper.toDtoList(quotationRepository.findAll());
    }

    @Transactional(readOnly = true)
    public QuotationDTO findById(Long id) {
        return quotationRepository.findById(id)
                .map(quotationMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Cotización no encontrada"));
    }

    public void delete(Long id) {
        if (!quotationRepository.existsById(id)) {
            throw new RuntimeException("Cotización no encontrada");
        }
        quotationRepository.deleteById(id);
    }
}
