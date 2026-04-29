package com.quotation.system.interfaces.rest;

import com.quotation.system.application.dto.ClientDTO;
import com.quotation.system.application.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
@Tag(name = "Clientes", description = "Gestión de clientes del sistema")
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    @Operation(summary = "Crear un nuevo cliente")
    public ResponseEntity<ClientDTO> create(@Valid @RequestBody ClientDTO clientDTO) {
        return new ResponseEntity<>(clientService.create(clientDTO), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar todos los clientes")
    public ResponseEntity<List<ClientDTO>> findAll() {
        return ResponseEntity.ok(clientService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un cliente por ID")
    public ResponseEntity<ClientDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un cliente existente")
    public ResponseEntity<ClientDTO> update(@PathVariable Long id, @Valid @RequestBody ClientDTO clientDTO) {
        return ResponseEntity.ok(clientService.update(id, clientDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un cliente")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
