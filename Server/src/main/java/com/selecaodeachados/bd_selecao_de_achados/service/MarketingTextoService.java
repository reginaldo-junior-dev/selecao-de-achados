package com.selecaodeachados.bd_selecao_de_achados.service;

import com.selecaodeachados.bd_selecao_de_achados.dto.MarketingTextoRequestDTO;
import com.selecaodeachados.bd_selecao_de_achados.dto.MarketingTextoResponseDTO;
import com.selecaodeachados.bd_selecao_de_achados.model.MarketingTexto;
import com.selecaodeachados.bd_selecao_de_achados.model.Produto;
import com.selecaodeachados.bd_selecao_de_achados.repository.MarketingTextoRepository;
import com.selecaodeachados.bd_selecao_de_achados.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketingTextoService {

    private final MarketingTextoRepository marketingTextoRepository;
    private final ProdutoRepository produtoRepository;

    @Transactional(readOnly = true)
    public List<MarketingTextoResponseDTO> listarPorProduto(Integer produtoId) {
        return marketingTextoRepository.findByProdutoId(produtoId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional
    public MarketingTextoResponseDTO criar(MarketingTextoRequestDTO dto) {
        Produto produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + dto.produtoId()));

        if (marketingTextoRepository.existsByProdutoIdAndRedeSocial(dto.produtoId(), dto.redeSocial())) {
            throw new IllegalArgumentException(
                    "Já existe um texto de marketing cadastrado para " + dto.redeSocial() + " neste produto.");
        }

        MarketingTexto texto = MarketingTexto.builder()
                .produto(produto)
                .redeSocial(dto.redeSocial())
                .conteudo(dto.conteudo())
                .build();

        return toResponseDTO(marketingTextoRepository.save(texto));
    }

    @Transactional
    public MarketingTextoResponseDTO atualizar(Integer id, MarketingTextoRequestDTO dto) {
        MarketingTexto texto = marketingTextoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Texto de marketing não encontrado: " + id));

        if (!texto.getProduto().getId().equals(dto.produtoId())) {
            throw new IllegalArgumentException("O produtoId informado não corresponde ao registro.");
        }

        if (!texto.getRedeSocial().equals(dto.redeSocial())) {
            throw new IllegalArgumentException("A rede social informada não corresponde ao registro.");
        }

        texto.setConteudo(dto.conteudo());

        return toResponseDTO(marketingTextoRepository.save(texto));
    }

    @Transactional
    public MarketingTextoResponseDTO alternarPublicacao(Integer id) {
        MarketingTexto texto = marketingTextoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Texto de marketing não encontrado: " + id));

        boolean novoStatus = !texto.getPublicado();
        texto.setPublicado(novoStatus);
        texto.setDataPublicacao(novoStatus ? LocalDateTime.now() : null);

        return toResponseDTO(marketingTextoRepository.save(texto));
    }

    @Transactional
    public void deletar(Integer id) {
        if (!marketingTextoRepository.existsById(id)) {
            throw new EntityNotFoundException("Texto de marketing não encontrado: " + id);
        }
        marketingTextoRepository.deleteById(id);
    }

    private MarketingTextoResponseDTO toResponseDTO(MarketingTexto texto) {
        return new MarketingTextoResponseDTO(
                texto.getId(),
                texto.getProduto().getId(),
                texto.getRedeSocial(),
                texto.getConteudo(),
                texto.getPublicado(),
                texto.getDataPublicacao()
        );
    }
}
