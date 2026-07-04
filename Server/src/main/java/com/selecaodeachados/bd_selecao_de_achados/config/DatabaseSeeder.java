package com.selecaodeachados.bd_selecao_de_achados.config;

import com.selecaodeachados.bd_selecao_de_achados.model.Administrador;
import com.selecaodeachados.bd_selecao_de_achados.repository.AdministradorRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DatabaseSeeder {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);
    private final AdministradorRepository administradorRepository;

    @Value("${admin.email:}")
    private String adminEmail;

    @Value("${admin.password:}")
    private String adminPassword;

    @Bean
    public CommandLineRunner seedAdmin() {
        return args -> {
            if (adminEmail.isBlank() || adminPassword.isBlank()) {
                log.warn("admin.email e admin.password não configurados. Seed de admin será ignorado.");
                return;
            }

            String senhaHash = new BCryptPasswordEncoder().encode(adminPassword);
            var admins = administradorRepository.findAll();

            if (!admins.isEmpty()) {
                var admin = admins.getFirst();
                admin.setEmail(adminEmail);
                admin.setSenhaHash(senhaHash);
                administradorRepository.save(admin);
                log.info("Admin atualizado: {}", adminEmail);
            } else {
                var admin = Administrador.builder()
                        .nome("Administrador")
                        .email(adminEmail)
                        .senhaHash(senhaHash)
                        .ativo(true)
                        .build();
                administradorRepository.save(admin);
                log.info("Admin criado: {}", adminEmail);
            }
        };
    }
}
