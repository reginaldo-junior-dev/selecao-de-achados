package com.selecaodeachados.bd_selecao_de_achados.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

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
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String nomeOriginal = file.getOriginalFilename();
            if (nomeOriginal == null) nomeOriginal = "imagem.jpg";
            Path destino = uploadPath.resolve(nomeOriginal);
            int contador = 1;
            while (Files.exists(destino)) {
                String nomeSemExt = nomeOriginal.contains(".")
                    ? nomeOriginal.substring(0, nomeOriginal.lastIndexOf("."))
                    : nomeOriginal;
                String ext = nomeOriginal.contains(".")
                    ? nomeOriginal.substring(nomeOriginal.lastIndexOf("."))
                    : "";
                destino = uploadPath.resolve(nomeSemExt + "_" + contador + ext);
                contador++;
            }

            Files.copy(file.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);

            return ResponseEntity.ok(Map.of("url", "/uploads/" + destino.getFileName().toString()));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao salvar arquivo"));
        }
    }
}
