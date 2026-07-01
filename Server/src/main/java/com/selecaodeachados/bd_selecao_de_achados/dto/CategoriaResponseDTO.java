package com.selecaodeachados.bd_selecao_de_achados.dto;

public record CategoriaResponseDTO(
        Integer id,
        String slug,
        String nome,
        String icone,
        Integer ordem,
        Boolean ativo
) {
}
