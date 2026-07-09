package com.selecaodeachados.bd_selecao_de_achados.service;

import com.selecaodeachados.bd_selecao_de_achados.dto.ProdutoRequestDTO;
import com.selecaodeachados.bd_selecao_de_achados.dto.ProdutoResponseDTO;
import com.selecaodeachados.bd_selecao_de_achados.model.Categoria;
import com.selecaodeachados.bd_selecao_de_achados.model.Produto;
import com.selecaodeachados.bd_selecao_de_achados.repository.CategoriaRepository;
import com.selecaodeachados.bd_selecao_de_achados.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public Page<ProdutoResponseDTO> listarAtivos(Pageable pageable) {
        return produtoRepository.findByAtivoTrueOrderByOrdemAsc(pageable)
                .map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProdutoResponseDTO> listarPorCategoria(String slugCategoria, Pageable pageable) {
        return produtoRepository.findByAtivoTrueAndCategoriasSlug(slugCategoria, pageable)
                .map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProdutoResponseDTO> buscarPorNome(String nome, Pageable pageable) {
        return produtoRepository.findByAtivoTrueAndNomeContainingIgnoreCaseOrderByOrdemAsc(nome, pageable)
                .map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<ProdutoResponseDTO> listarTodosAdmin(String slugCategoria, String nome, Pageable pageable) {
        if (nome != null && !nome.isBlank()) {
            return produtoRepository.findByNomeContainingIgnoreCaseOrderByOrdemAsc(nome, pageable)
                    .map(this::toResponseDTO);
        }

        if (slugCategoria != null && !slugCategoria.isBlank()) {
            return produtoRepository.findByCategoriasSlug(slugCategoria, pageable)
                    .map(this::toResponseDTO);
        }

        return produtoRepository.findAllByOrderByOrdemAsc(pageable)
                .map(this::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDTO buscarPorId(Integer id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + id));
        return toResponseDTO(produto);
    }

    @Transactional
    public ProdutoResponseDTO criar(ProdutoRequestDTO dto) {
        Set<Categoria> categorias = new HashSet<>(categoriaRepository.findAllById(dto.categoriasIds()));
        if (categorias.size() != dto.categoriasIds().size()) {
            throw new EntityNotFoundException("Uma ou mais categorias não foram encontradas");
        }

        Produto produto = Produto.builder()
                .nome(dto.nome())
                .categorias(categorias)
                .chamada(dto.chamada())
                .badge(dto.badge())
                .imagem(dto.imagem())
                .linkAfiliado(dto.linkAfiliado())
                .origem(dto.origem())
                .ativo(dto.ativo())
                .ordem(dto.ordem())
                .cliques(0)
                .build();

        return toResponseDTO(produtoRepository.save(produto));
    }

    @Transactional
    public ProdutoResponseDTO atualizar(Integer id, ProdutoRequestDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + id));

        Set<Categoria> categorias = new HashSet<>(categoriaRepository.findAllById(dto.categoriasIds()));
        if (categorias.size() != dto.categoriasIds().size()) {
            throw new EntityNotFoundException("Uma ou mais categorias não foram encontradas");
        }

        produto.setNome(dto.nome());
        produto.setCategorias(categorias);
        produto.setChamada(dto.chamada());
        produto.setBadge(dto.badge());
        produto.setImagem(dto.imagem());
        produto.setLinkAfiliado(dto.linkAfiliado());
        produto.setOrigem(dto.origem());
        produto.setAtivo(dto.ativo());
        produto.setOrdem(dto.ordem());

        return toResponseDTO(produtoRepository.save(produto));
    }

    @Transactional
    public void deletar(Integer id) {
        if (!produtoRepository.existsById(id)) {
            throw new EntityNotFoundException("Produto não encontrado: " + id);
        }
        produtoRepository.deleteById(id);
    }

    private ProdutoResponseDTO toResponseDTO(Produto produto) {
        return new ProdutoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getCategorias().stream()
                        .map(c -> new ProdutoResponseDTO.CategoriaInfo(c.getId(), c.getNome(), c.getSlug()))
                        .toList(),
                produto.getChamada(),
                produto.getBadge(),
                produto.getImagem(),
                produto.getLinkAfiliado(),
                produto.getOrigem(),
                produto.getAtivo(),
                produto.getOrdem(),
                produto.getCliques()
        );
    }
}
