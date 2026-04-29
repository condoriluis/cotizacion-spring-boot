package com.quotation.system.application.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "El usuario es obligatorio")
    private String username;
    
    @NotBlank(message = "La contraseña es obligatoria")
    private String password;
}
