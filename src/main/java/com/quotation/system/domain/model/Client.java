package com.quotation.system.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    private Long id;
    private String nombre;
    private String email;
    private String telefono;
}
