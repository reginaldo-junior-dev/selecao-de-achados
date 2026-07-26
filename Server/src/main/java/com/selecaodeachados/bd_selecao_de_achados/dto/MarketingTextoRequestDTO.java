package com.selecaodeachados.bd_selecao_de_achados.dto;

import com.selecaodeachados.bd_selecao_de_achados.model.RedeSocial;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MarketingTextoRequestDTO(
        @NotNull Integer produtoId,
        @NotNull RedeSocial redeSocial,
        @NotBlank String conteudo
) {
}
