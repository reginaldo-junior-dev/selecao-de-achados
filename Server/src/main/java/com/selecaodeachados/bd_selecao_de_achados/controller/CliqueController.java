package com.selecaodeachados.bd_selecao_de_achados.controller;

import com.selecaodeachados.bd_selecao_de_achados.dto.CliqueRequestDTO;
import com.selecaodeachados.bd_selecao_de_achados.service.CliqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cliques")
@RequiredArgsConstructor
public class CliqueController {

    private final CliqueService cliqueService;

    @PostMapping("/{produtoId}")
    public ResponseEntity<Void> registrar(@PathVariable Integer produtoId,
                                          @RequestBody(required = false) CliqueRequestDTO dto) {
        if (dto == null) {
            dto = new CliqueRequestDTO(null, null, null);
        }
        cliqueService.registrarClique(produtoId, dto);
        return ResponseEntity.ok().build();
    }
}
