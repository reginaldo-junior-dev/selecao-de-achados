package com.selecaodeachados.bd_selecao_de_achados.dto;

import com.selecaodeachados.bd_selecao_de_achados.model.RedeSocial;

import java.time.LocalDateTime;

public record MarketingTextoResponseDTO(
        Integer id,
        Integer produtoId,
        RedeSocial redeSocial,
        String conteudo,
        Boolean publicado,
        LocalDateTime dataPublicacao
) {
}
