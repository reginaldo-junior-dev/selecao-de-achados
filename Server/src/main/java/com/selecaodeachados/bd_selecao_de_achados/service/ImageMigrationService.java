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
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    public List<Map<String, Object>> migrarTodasImagens() {
        List<String> urls = produtoRepository.findAll()
                .stream()
                .map(p -> p.getImagem())
                .filter(url -> url != null && url.startsWith(supabaseUrl))
                .distinct()
                .toList();

        log.info("Migrando {} imagens...", urls.size());

        List<Map<String, Object>> resultados = new ArrayList<>();

        for (String publicUrl : urls) {
            try {
                String nomeArquivo = publicUrl.substring(publicUrl.lastIndexOf("/") + 1);
                String storageUrl = supabaseUrl + "/storage/v1/object/produtos/" + nomeArquivo;

                byte[] originalBytes;
                try (InputStream in = new URL(publicUrl).openStream()) {
                    originalBytes = in.readAllBytes();
                }

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                Thumbnails.of(new ByteArrayInputStream(originalBytes))
                        .size(1200, 1200)
                        .outputQuality(0.80)
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
                restTemplate.exchange(storageUrl, HttpMethod.POST, entity, String.class);

                long reducao = ((originalBytes.length - compressed.length) * 100) / originalBytes.length;
                log.info("OK: {} ({} → {}, {}%)", nomeArquivo, originalBytes.length, compressed.length, reducao);

                resultados.add(Map.of(
                        "url", publicUrl,
                        "status", "ok",
                        "antes", originalBytes.length,
                        "depois", compressed.length,
                        "reducao", reducao + "%"
                ));
            } catch (Exception e) {
                log.error("Erro ao processar {}: {}", publicUrl, e.getMessage());
                resultados.add(Map.of(
                        "url", publicUrl,
                        "status", "erro",
                        "erro", e.getMessage()
                ));
            }
        }

        return resultados;
    }
}
