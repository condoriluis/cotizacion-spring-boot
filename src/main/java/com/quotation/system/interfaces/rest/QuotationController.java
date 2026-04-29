package com.quotation.system.interfaces.rest;

import com.quotation.system.application.dto.QuotationDTO;
import com.quotation.system.application.service.QuotationService;
import com.quotation.system.domain.model.QuotationStatus;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/quotations")
@RequiredArgsConstructor
@Tag(name = "Cotizaciones", description = "Generación y seguimiento de cotizaciones")
public class QuotationController {

    private final QuotationService quotationService;

    @PostMapping
    @Operation(summary = "Generar una nueva cotización")
    public ResponseEntity<QuotationDTO> create(@Valid @RequestBody QuotationDTO quotationDTO) {
        return new ResponseEntity<>(quotationService.create(quotationDTO), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar todas las cotizaciones")
    public ResponseEntity<List<QuotationDTO>> findAll() {
        return ResponseEntity.ok(quotationService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener detalle de una cotización")
    public ResponseEntity<QuotationDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(quotationService.findById(id));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cambiar el estado de una cotización (PENDIENTE, ENVIADA, ACEPTADA)")
    public ResponseEntity<QuotationDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam QuotationStatus status) {
        return ResponseEntity.ok(quotationService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una cotización")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        quotationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
