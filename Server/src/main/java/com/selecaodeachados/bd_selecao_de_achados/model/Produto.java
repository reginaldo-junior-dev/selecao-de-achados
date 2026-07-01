package com.selecaodeachados.bd_selecao_de_achados.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "produtos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String nome;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(nullable = false, length = 255)
    private String chamada;

    @Column(length = 50)
    private String badge;

    @Column(nullable = false, length = 500)
    private String imagem;

    @Column(name = "link_afiliado")
    private String linkAfiliado;

    @Column(nullable = false, length = 20)
    private String origem;

    @Column(nullable = false)
    private Boolean ativo;

    @Column(name = "ordem", nullable = false)
    private Integer ordem;

    @Column(nullable = false)
    private Integer cliques;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;

    @PrePersist
    protected void onCreate() {
        this.criadoEm = LocalDateTime.now();
        this.atualizadoEm = LocalDateTime.now();
        if (this.cliques == null) {
            this.cliques = 0;
        }
        if (this.ativo == null) {
            this.ativo = true;
        }
        if (this.ordem == null) {
            this.ordem = 0;
        }
        if (this.origem == null) {
            this.origem = "mercadolivre";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.atualizadoEm = LocalDateTime.now();
    }
}
