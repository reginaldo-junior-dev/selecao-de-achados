package com.selecaodeachados.bd_selecao_de_achados.config;

import com.selecaodeachados.bd_selecao_de_achados.model.Administrador;
import com.selecaodeachados.bd_selecao_de_achados.repository.AdministradorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DatabaseSeeder {

    private final AdministradorRepository administradorRepository;

    @Bean
    public CommandLineRunner seedAdmin() {
        return args -> {
            String email = "selecaoms45@.com";
            String senhaHash = new BCryptPasswordEncoder().encode("7151Ms#1419");

            var admins = administradorRepository.findAll();

            if (!admins.isEmpty()) {
                var admin = admins.getFirst();
                admin.setSenhaHash(senhaHash);
                administradorRepository.save(admin);
            } else {
                var admin = Administrador.builder()
                        .nome("Administrador")
                        .email(email)
                        .senhaHash(senhaHash)
                        .ativo(true)
                        .build();
                administradorRepository.save(admin);
            }
        };
    }
}
