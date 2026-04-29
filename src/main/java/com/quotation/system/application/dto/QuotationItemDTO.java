package com.quotation.system.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuotationItemDTO {
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @NotNull(message = "El ID del producto es obligatorio")
    private Long productId;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private String productNombre;
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad mínima es 1")
    private Integer cantidad;
    
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private BigDecimal precioUnitario;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private BigDecimal subtotal;
}
