package com.selecaodeachados.bd_selecao_de_achados.service;

import com.selecaodeachados.bd_selecao_de_achados.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageMigrationService {

    private final ProdutoRepository produtoRepository;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    public Map<String, Object> migrarTodasImagens() {
        List<String> urls = produtoRepository.findAll()
                .stream()
                .map(p -> p.getImagem())
                .filter(url -> url != null && url.startsWith(supabaseUrl))
                .distinct()
                .toList();

        log.info("Migrando {} imagens...", urls.size());

        int total = urls.size();
        int ok = 0;
        int erro = 0;

        for (int i = 0; i < total; i++) {
            String publicUrl = urls.get(i);
            try {
                processarImagem(publicUrl);
                ok++;
                log.info("[{}/{}] OK: {}", i + 1, total, publicUrl);
            } catch (Exception e) {
                erro++;
                log.error("[{}/{}] ERRO: {} - {}", i + 1, total, publicUrl, e.getMessage());
            }
            System.gc();
        }

        return Map.of("total", total, "ok", ok, "erro", erro);
    }

    private void processarImagem(String publicUrl) throws Exception {
        String nomeArquivo = publicUrl.substring(publicUrl.lastIndexOf("/") + 1);
        String storageUrl = supabaseUrl + "/storage/v1/object/produtos/" + nomeArquivo;

        byte[] originalBytes;
        try (InputStream in = new URL(publicUrl).openStream()) {
            originalBytes = in.readAllBytes();
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Thumbnails.of(new ByteArrayInputStream(originalBytes))
                .size(800, 800)
                .outputQuality(0.75)
                .toOutputStream(baos);
        byte[] compressed = baos.toByteArray();

        String ext = nomeArquivo.contains(".")
                ? nomeArquivo.substring(nomeArquivo.lastIndexOf("."))
                : ".jpg";
        String contentType = switch (ext.toLowerCase()) {
            case ".png" -> "image/png";
            case ".webp" -> "image/webp";
            default -> "image/jpeg";
        };

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + serviceRoleKey);
        headers.setContentType(MediaType.parseMediaType(contentType));

        HttpEntity<byte[]> entity = new HttpEntity<>(compressed, headers);
        new RestTemplate().exchange(storageUrl, HttpMethod.POST, entity, String.class);

        long reducao = ((originalBytes.length - compressed.length) * 100) / originalBytes.length;
        log.info("  {} ({} → {}, {}%)", nomeArquivo, formatBytes(originalBytes.length), formatBytes(compressed.length), reducao);
    }

    private String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + "B";
        if (bytes < 1024 * 1024) return (bytes / 1024) + "KB";
        return (bytes / (1024 * 1024)) + "MB";
    }
}
