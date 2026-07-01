package com.selecaodeachados.bd_selecao_de_achados.controller;

import com.selecaodeachados.bd_selecao_de_achados.dto.ProdutoRequestDTO;
import com.selecaodeachados.bd_selecao_de_achados.dto.ProdutoResponseDTO;
import com.selecaodeachados.bd_selecao_de_achados.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<Page<ProdutoResponseDTO>> listar(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String busca,
            @PageableDefault(size = 16, sort = "ordem") Pageable pageable) {

        if (busca != null && !busca.isBlank()) {
            return ResponseEntity.ok(produtoService.buscarPorNome(busca, pageable));
        }

        if (categoria != null && !categoria.isBlank()) {
            return ResponseEntity.ok(produtoService.listarPorCategoria(categoria, pageable));
        }

        return ResponseEntity.ok(produtoService.listarAtivos(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criar(@RequestBody @Valid ProdutoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizar(@PathVariable Integer id,
                                                        @RequestBody @Valid ProdutoRequestDTO dto) {
        return ResponseEntity.ok(produtoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
