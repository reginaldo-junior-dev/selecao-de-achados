package com.selecaodeachados.bd_selecao_de_achados.repository;

import com.selecaodeachados.bd_selecao_de_achados.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {

    Optional<Categoria> findBySlug(String slug);
}
