package com.quotation.system.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quotation {
    private Long id;
    private Long clienteId;
    private String clientNombre;
    private LocalDateTime fecha;
    private QuotationStatus estado;
    private BigDecimal total;
    @Builder.Default
    private List<QuotationItem> items = new ArrayList<>();

    public void calculateTotal() {
        this.total = items.stream()
                .peek(QuotationItem::calculateSubtotal)
                .map(QuotationItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public boolean isEditable() {
        return !QuotationStatus.ACEPTADA.equals(this.estado);
    }
}
