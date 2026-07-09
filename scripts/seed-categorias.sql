-- Categorias iniciais para ambiente Docker
INSERT INTO categorias (slug, nome, icone, ordem, ativo, criado_em, atualizado_em)
VALUES
    ('cozinha', 'Cozinha', '🍳', 1, true, NOW(), NOW()),
    ('casa', 'Casa & Organização', '🏠', 2, true, NOW(), NOW()),
    ('jardim', 'Jardim & Decoração', '🌿', 3, true, NOW(), NOW()),
    ('utilidades', 'Utilidades', '🔧', 4, true, NOW(), NOW()),
    ('beleza', 'Beleza & Cuidado', '💄', 5, true, NOW(), NOW()),
    ('limpeza', 'Limpeza', '🧹', 6, true, NOW(), NOW()),
    ('achados-premium', 'Achados Premium', '💎', 7, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;
