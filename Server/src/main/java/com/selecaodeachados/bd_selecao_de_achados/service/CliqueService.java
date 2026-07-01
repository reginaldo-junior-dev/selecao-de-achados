package com.selecaodeachados.bd_selecao_de_achados.service;

import com.selecaodeachados.bd_selecao_de_achados.dto.CliqueRequestDTO;
import com.selecaodeachados.bd_selecao_de_achados.model.Clique;
import com.selecaodeachados.bd_selecao_de_achados.model.Produto;
import com.selecaodeachados.bd_selecao_de_achados.repository.CliqueRepository;
import com.selecaodeachados.bd_selecao_de_achados.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CliqueService {

    private final CliqueRepository cliqueRepository;
    private final ProdutoRepository produtoRepository;

    @Transactional
    public void registrarClique(Integer produtoId, CliqueRequestDTO dto) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + produtoId));

        produto.setCliques(produto.getCliques() + 1);
        produtoRepository.save(produto);

        Clique clique = Clique.builder()
                .produto(produto)
                .ip(dto.ip())
                .userAgent(dto.userAgent())
                .referrer(dto.referrer())
                .build();

        cliqueRepository.save(clique);
    }
}
