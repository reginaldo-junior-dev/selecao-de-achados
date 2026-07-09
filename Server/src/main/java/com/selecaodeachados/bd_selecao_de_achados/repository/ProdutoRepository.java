package com.selecaodeachados.bd_selecao_de_achados.repository;

import com.selecaodeachados.bd_selecao_de_achados.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    @Query("SELECT DISTINCT p FROM Produto p JOIN p.categorias c WHERE c.slug = :slug AND p.ativo = true ORDER BY p.ordem ASC")
    Page<Produto> findByAtivoTrueAndCategoriasSlug(@Param("slug") String slug, Pageable pageable);

    Page<Produto> findByAtivoTrueOrderByOrdemAsc(Pageable pageable);

    Page<Produto> findByAtivoTrueAndNomeContainingIgnoreCaseOrderByOrdemAsc(String nome, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Produto p JOIN p.categorias c WHERE c.slug = :slug AND p.ativo = true ORDER BY p.ordem ASC")
    List<Produto> findByAtivoTrueAndCategoriasSlug(@Param("slug") String slug);

    List<Produto> findByAtivoTrueOrderByOrdemAsc();

    List<Produto> findByAtivoTrueAndNomeContainingIgnoreCaseOrderByOrdemAsc(String nome);

    @Query("SELECT DISTINCT p FROM Produto p JOIN p.categorias c WHERE c.slug = :slug ORDER BY p.ordem ASC")
    Page<Produto> findByCategoriasSlug(@Param("slug") String slug, Pageable pageable);

    Page<Produto> findAllByOrderByOrdemAsc(Pageable pageable);

    Page<Produto> findByNomeContainingIgnoreCaseOrderByOrdemAsc(String nome, Pageable pageable);
}
