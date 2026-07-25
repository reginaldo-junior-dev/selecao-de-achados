package com.selecaodeachados.bd_selecao_de_achados.controller;

import com.selecaodeachados.bd_selecao_de_achados.dto.MarketingTextoRequestDTO;
import com.selecaodeachados.bd_selecao_de_achados.dto.MarketingTextoResponseDTO;
import com.selecaodeachados.bd_selecao_de_achados.service.MarketingTextoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/marketing")
@RequiredArgsConstructor
public class AdminMarketingController {

    private final MarketingTextoService marketingTextoService;

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<MarketingTextoResponseDTO>> listarPorProduto(@PathVariable Integer produtoId) {
        return ResponseEntity.ok(marketingTextoService.listarPorProduto(produtoId));
    }

    @PostMapping
    public ResponseEntity<MarketingTextoResponseDTO> criar(@RequestBody @Valid MarketingTextoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(marketingTextoService.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MarketingTextoResponseDTO> atualizar(@PathVariable Integer id,
                                                                @RequestBody @Valid MarketingTextoRequestDTO dto) {
        return ResponseEntity.ok(marketingTextoService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        marketingTextoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
