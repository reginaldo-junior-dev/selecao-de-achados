package com.selecaodeachados.bd_selecao_de_achados.controller;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/upload")
public class UploadController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    @PostMapping
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Arquivo vazio"));
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Apenas imagens são permitidas"));
        }

        try {
            String nomeOriginal = file.getOriginalFilename();
            String ext = nomeOriginal != null && nomeOriginal.contains(".")
                ? nomeOriginal.substring(nomeOriginal.lastIndexOf("."))
                : ".jpg";
            String nomeArquivo = System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6) + ext;

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            Thumbnails.of(file.getInputStream())
                .size(1200, 1200)
                .outputQuality(0.80)
                .toOutputStream(outputStream);

            byte[] compressedBytes = outputStream.toByteArray();

            String storageUrl = supabaseUrl + "/storage/v1/object/produtos/" + nomeArquivo;

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + serviceRoleKey);
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setCacheControl(CacheControl.maxAge(31536000, java.util.concurrent.TimeUnit.SECONDS).cachePublic());

            HttpEntity<byte[]> entity = new HttpEntity<>(compressedBytes, headers);
            restTemplate.exchange(storageUrl, HttpMethod.POST, entity, String.class);

            String publicUrl = supabaseUrl + "/storage/v1/object/public/produtos/" + nomeArquivo;
            return ResponseEntity.ok(Map.of("url", publicUrl));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao processar imagem"));
        }
    }
}
