package com.selecaodeachados.bd_selecao_de_achados.repository;

import com.selecaodeachados.bd_selecao_de_achados.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    Page<Produto> findByAtivoTrueAndCategoriaSlugOrderByOrdemAsc(String slug, Pageable pageable);

    Page<Produto> findByAtivoTrueOrderByOrdemAsc(Pageable pageable);

    Page<Produto> findByAtivoTrueAndNomeContainingIgnoreCaseOrderByOrdemAsc(String nome, Pageable pageable);

    List<Produto> findByAtivoTrueAndCategoriaSlugOrderByOrdemAsc(String slug);

    List<Produto> findByAtivoTrueOrderByOrdemAsc();

    List<Produto> findByAtivoTrueAndNomeContainingIgnoreCaseOrderByOrdemAsc(String nome);

    Page<Produto> findByCategoriaSlugOrderByOrdemAsc(String slug, Pageable pageable);

    Page<Produto> findAllByOrderByOrdemAsc(Pageable pageable);

    Page<Produto> findByNomeContainingIgnoreCaseOrderByOrdemAsc(String nome, Pageable pageable);
}
