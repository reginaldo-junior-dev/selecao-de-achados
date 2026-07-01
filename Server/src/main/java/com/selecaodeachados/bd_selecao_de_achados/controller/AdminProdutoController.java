package com.selecaodeachados.bd_selecao_de_achados.controller;

import com.selecaodeachados.bd_selecao_de_achados.dto.ProdutoResponseDTO;
import com.selecaodeachados.bd_selecao_de_achados.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/produtos")
@RequiredArgsConstructor
public class AdminProdutoController {

    private final ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<Page<ProdutoResponseDTO>> listar(
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String busca,
            @PageableDefault(size = 16, sort = "ordem") Pageable pageable) {
        return ResponseEntity.ok(produtoService.listarTodosAdmin(categoria, busca, pageable));
    }
}
