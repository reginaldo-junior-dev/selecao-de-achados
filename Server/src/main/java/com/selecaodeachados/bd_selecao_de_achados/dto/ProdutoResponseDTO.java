package com.selecaodeachados.bd_selecao_de_achados.dto;

import java.util.List;

public record ProdutoResponseDTO(
        Integer id,
        String nome,
        List<CategoriaInfo> categorias,
        String chamada,
        String badge,
        String imagem,
        String linkAfiliado,
        String origem,
        Boolean ativo,
        Integer ordem,
        Integer cliques
) {
    public record CategoriaInfo(Integer id, String nome, String slug) {}
}
