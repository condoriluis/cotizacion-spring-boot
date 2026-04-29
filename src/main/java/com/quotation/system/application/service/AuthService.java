package com.quotation.system.application.service;

import com.quotation.system.application.dto.AuthResponse;
import com.quotation.system.application.dto.LoginRequest;
import com.quotation.system.application.dto.RegisterRequest;
import com.quotation.system.domain.model.Role;
import com.quotation.system.domain.model.User;
import com.quotation.system.domain.repository.UserRepository;
import com.quotation.system.infrastructure.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;

    public AuthResponse register(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        User savedUser = userRepository.save(user);
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getUsername());
        String jwtToken = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);
        
        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .username(savedUser.getUsername())
                .role(savedUser.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String jwtToken = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);
        
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        
        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse refreshToken(String token) {
        String username = jwtUtils.extractUsername(token);
        if (username != null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtUtils.isTokenValid(token, userDetails)) {
                String accessToken = jwtUtils.generateToken(userDetails);
                User user = userRepository.findByUsername(username).orElseThrow();
                
                return AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(token)
                        .username(username)
                        .role(user.getRole().name())
                        .build();
            }
        }
        throw new RuntimeException("Refresh token inválido");
    }
}
