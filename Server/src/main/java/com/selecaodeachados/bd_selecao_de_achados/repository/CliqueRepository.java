package com.selecaodeachados.bd_selecao_de_achados.repository;

import com.selecaodeachados.bd_selecao_de_achados.model.Clique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CliqueRepository extends JpaRepository<Clique, Long> {
}
