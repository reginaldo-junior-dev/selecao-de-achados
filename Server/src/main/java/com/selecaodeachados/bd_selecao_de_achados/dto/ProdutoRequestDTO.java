package com.selecaodeachados.bd_selecao_de_achados.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProdutoRequestDTO(
        @NotBlank @Size(max = 255) String nome,
        @NotNull Integer categoriaId,
        @NotBlank @Size(max = 255) String chamada,
        @Size(max = 50) String badge,
        @NotBlank @Size(max = 500) String imagem,
        String linkAfiliado,
        @NotBlank @Size(max = 20) String origem,
        @NotNull Boolean ativo,
        @NotNull Integer ordem
) {
}
