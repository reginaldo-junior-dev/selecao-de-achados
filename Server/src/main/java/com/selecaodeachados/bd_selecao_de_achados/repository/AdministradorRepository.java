package com.selecaodeachados.bd_selecao_de_achados.repository;

import com.selecaodeachados.bd_selecao_de_achados.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {

    Optional<Administrador> findByEmail(String email);
}
