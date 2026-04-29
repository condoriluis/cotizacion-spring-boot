package com.quotation.system.interfaces.rest;

import com.quotation.system.application.dto.AuthResponse;
import com.quotation.system.application.dto.LoginRequest;
import com.quotation.system.application.dto.RegisterRequest;
import com.quotation.system.application.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints para registro y login")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Registrar un nuevo usuario")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión y obtener tokens")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar el access token usando un refresh token")
    public ResponseEntity<AuthResponse> refresh(@RequestHeader("Authorization") String refreshToken) {
        // Remover "Bearer " si está presente
        String token = refreshToken.startsWith("Bearer ") ? refreshToken.substring(7) : refreshToken;
        return ResponseEntity.ok(authService.refreshToken(token));
    }
}
