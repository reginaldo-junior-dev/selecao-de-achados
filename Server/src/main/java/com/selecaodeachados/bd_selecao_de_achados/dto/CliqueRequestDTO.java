package com.selecaodeachados.bd_selecao_de_achados.dto;

public record CliqueRequestDTO(
        String ip,
        String userAgent,
        String referrer
) {
}
