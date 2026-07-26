package com.selecaodeachados.bd_selecao_de_achados.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "textos_marketing", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "produto_id", "rede_social" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketingTexto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Enumerated(EnumType.STRING)
    @Column(name = "rede_social", nullable = false, length = 20)
    private RedeSocial redeSocial;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;
}
