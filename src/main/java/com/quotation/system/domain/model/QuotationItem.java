package com.quotation.system.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuotationItem {
    private Long id;
    private Long productId;
    private String productNombre;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;

    public void calculateSubtotal() {
        if (cantidad != null && precioUnitario != null) {
            this.subtotal = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
        }
    }
}
