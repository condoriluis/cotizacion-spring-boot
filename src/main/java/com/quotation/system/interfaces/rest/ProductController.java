package com.quotation.system.interfaces.rest;

import com.quotation.system.application.dto.ProductDTO;
import com.quotation.system.application.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "Productos", description = "Gestión de catálogo de productos y stock")
public class ProductController {

    private final ProductService productService;

    @PostMapping
    @Operation(summary = "Crear un nuevo producto")
    public ResponseEntity<ProductDTO> create(@Valid @RequestBody ProductDTO productDTO) {
        return new ResponseEntity<>(productService.create(productDTO), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Listar todos los productos")
    public ResponseEntity<List<ProductDTO>> findAll() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un producto por ID")
    public ResponseEntity<ProductDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un producto")
    public ResponseEntity<ProductDTO> update(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.update(id, productDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un producto")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
