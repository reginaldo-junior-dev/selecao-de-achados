package com.selecaodeachados.bd_selecao_de_achados.service;

import com.selecaodeachados.bd_selecao_de_achados.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        List<String> urls = produtoRepository.findAllByOrderByOrdemAsc(null)
                .stream()
                .map(p -> p.getImagem())
                .filter(url -> url != null && url.startsWith(supabaseUrl))
                .distinct()
                .collect(Collectors.toList());

        List<Map<String, Object>> resultados = new ArrayList<>();

        for (String publicUrl : urls) {
            try {
                String nomeArquivo = publicUrl.substring(publicUrl.lastIndexOf("/") + 1);
                String storageUrl = supabaseUrl + "/storage/v1/object/produtos/" + nomeArquivo;

                URL url = new URL(publicUrl);
                byte[] originalBytes;
                try (InputStream in = url.openStream()) {
                    originalBytes = in.readAllBytes();
                }

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                Thumbnails.of(new java.io.ByteArrayInputStream(originalBytes))
                        .size(1200, 1200)
                        .outputQuality(0.80)
                        .toOutputStream(baos);
                byte[] compressed = baos.toByteArray();

                String ext = nomeArquivo.contains(".")
                        ? nomeArquivo.substring(nomeArquivo.lastIndexOf("."))
                        : ".jpg";
                String contentType;
                if (ext.equalsIgnoreCase(".png")) {
                    contentType = "image/png";
                } else if (ext.equalsIgnoreCase(".webp")) {
                    contentType = "image/webp";
                } else {
                    contentType = "image/jpeg";
                }

                HttpHeaders headers = new HttpHeaders();
                headers.set("Authorization", "Bearer " + serviceRoleKey);
                headers.setContentType(MediaType.parseMediaType(contentType));
                headers.setCacheControl(CacheControl.maxAge(31536000, java.util.concurrent.TimeUnit.SECONDS).cachePublic());

                HttpEntity<byte[]> entity = new HttpEntity<>(compressed, headers);
                restTemplate.exchange(storageUrl, HttpMethod.POST, entity, String.class);

                long reducao = ((originalBytes.length - compressed.length) * 100) / originalBytes.length;
                resultados.add(Map.of(
                        "url", publicUrl,
                        "status", "ok",
                        "antes", originalBytes.length,
                        "depois", compressed.length,
                        "reducao", reducao + "%"
                ));
            } catch (Exception e) {
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
