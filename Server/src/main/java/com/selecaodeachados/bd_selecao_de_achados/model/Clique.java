package com.selecaodeachados.bd_selecao_de_achados.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cliques")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Column(name = "clicado_em", nullable = false, updatable = false)
    private LocalDateTime clicadoEm;

    @Column(length = 45)
    private String ip;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(columnDefinition = "TEXT")
    private String referrer;

    @PrePersist
    protected void onCreate() {
        this.clicadoEm = LocalDateTime.now();
    }
}
