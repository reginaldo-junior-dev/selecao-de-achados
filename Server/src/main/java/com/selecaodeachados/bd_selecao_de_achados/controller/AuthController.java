package com.selecaodeachados.bd_selecao_de_achados.controller;

import com.selecaodeachados.bd_selecao_de_achados.config.JwtUtil;
import com.selecaodeachados.bd_selecao_de_achados.model.Administrador;
import com.selecaodeachados.bd_selecao_de_achados.repository.AdministradorRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AdministradorRepository administradorRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
        Optional<Administrador> optional = administradorRepository.findByEmail(request.email());

        if (optional.isEmpty() || !passwordEncoder.matches(request.senha(), optional.get().getSenhaHash())) {
            return ResponseEntity.status(401).body(Map.of("erro", "Credenciais inválidas"));
        }

        Administrador admin = optional.get();
        String token = jwtUtil.gerarToken(admin.getEmail());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "nome", admin.getNome(),
                "email", admin.getEmail()
        ));
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String senha
    ) {
    }
}
