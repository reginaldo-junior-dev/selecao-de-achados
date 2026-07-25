package com.selecaodeachados.bd_selecao_de_achados.repository;

import com.selecaodeachados.bd_selecao_de_achados.model.MarketingTexto;
import com.selecaodeachados.bd_selecao_de_achados.model.RedeSocial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarketingTextoRepository extends JpaRepository<MarketingTexto, Integer> {

    List<MarketingTexto> findByProdutoId(Integer produtoId);

    boolean existsByProdutoIdAndRedeSocial(Integer produtoId, RedeSocial redeSocial);

    Optional<MarketingTexto> findByProdutoIdAndRedeSocial(Integer produtoId, RedeSocial redeSocial);
}
