package com.selecaodeachados.bd_selecao_de_achados.service;

import com.selecaodeachados.bd_selecao_de_achados.dto.CategoriaRequestDTO;
import com.selecaodeachados.bd_selecao_de_achados.dto.CategoriaResponseDTO;
import com.selecaodeachados.bd_selecao_de_achados.model.Categoria;
import com.selecaodeachados.bd_selecao_de_achados.repository.CategoriaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> listarTodas() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponseDTO buscarPorId(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + id));
        return toResponseDTO(categoria);
    }

    @Transactional
    public CategoriaResponseDTO criar(CategoriaRequestDTO dto) {
        Categoria categoria = Categoria.builder()
                .slug(dto.slug())
                .nome(dto.nome())
                .icone(dto.icone())
                .ordem(dto.ordem())
                .ativo(dto.ativo())
                .build();
        return toResponseDTO(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponseDTO atualizar(Integer id, CategoriaRequestDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoria não encontrada: " + id));

        categoria.setSlug(dto.slug());
        categoria.setNome(dto.nome());
        categoria.setIcone(dto.icone());
        categoria.setOrdem(dto.ordem());
        categoria.setAtivo(dto.ativo());

        return toResponseDTO(categoriaRepository.save(categoria));
    }

    @Transactional
    public void deletar(Integer id) {
        if (!categoriaRepository.existsById(id)) {
            throw new EntityNotFoundException("Categoria não encontrada: " + id);
        }
        categoriaRepository.deleteById(id);
    }

    private CategoriaResponseDTO toResponseDTO(Categoria categoria) {
        return new CategoriaResponseDTO(
                categoria.getId(),
                categoria.getSlug(),
                categoria.getNome(),
                categoria.getIcone(),
                categoria.getOrdem(),
                categoria.getAtivo()
        );
    }
}
