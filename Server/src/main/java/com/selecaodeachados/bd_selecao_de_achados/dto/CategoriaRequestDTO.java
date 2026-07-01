package com.selecaodeachados.bd_selecao_de_achados.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CategoriaRequestDTO(
        @NotBlank @Size(max = 50) String slug,
        @NotBlank @Size(max = 100) String nome,
        @NotBlank @Size(max = 20) String icone,
        @NotNull Integer ordem,
        @NotNull Boolean ativo
) {
}
