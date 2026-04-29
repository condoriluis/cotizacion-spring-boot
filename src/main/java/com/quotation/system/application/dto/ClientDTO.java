package com.quotation.system.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDTO {
    @Schema(accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;
    
    @Email(message = "Email no válido")
    @NotBlank(message = "El email es obligatorio")
    private String email;
    
    private String telefono;
}
