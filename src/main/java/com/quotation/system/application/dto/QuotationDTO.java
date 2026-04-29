package com.quotation.system.application.dto;

import com.quotation.system.domain.model.QuotationStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuotationDTO {
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @NotNull(message = "El ID del cliente es obligatorio")
    private Long clienteId;

    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private String clientNombre;
    
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime fecha;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private QuotationStatus estado;
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private BigDecimal total;
    
    @NotEmpty(message = "La cotización debe tener al menos un item")
    @Valid
    private List<QuotationItemDTO> items;
}
