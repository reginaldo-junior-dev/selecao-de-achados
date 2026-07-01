package com.selecaodeachados.bd_selecao_de_achados.dto;

public record ProdutoResponseDTO(
        Integer id,
        String nome,
        Integer categoriaId,
        String categoriaNome,
        String categoriaSlug,
        String chamada,
        String badge,
        String imagem,
        String linkAfiliado,
        String origem,
        Boolean ativo,
        Integer ordem,
        Integer cliques
) {
}
