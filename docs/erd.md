# Diagrama ER - Receitoteca

erDiagram

    USUARIO {
        INTEGER id PK
        VARCHAR_100 nome
        VARCHAR_100 email
        VARCHAR_255 senha
        VARCHAR_20 role
    }

    ETIQUETA {
        INTEGER id PK
        VARCHAR_50 nome
    }

    RECEITA {
        INTEGER id PK
        VARCHAR_255 img
        VARCHAR_100 title
        INTEGER time
        INTEGER servings
        INTEGER usuario_id FK
        TEXT ingredients
        TEXT steps
    }

    RECEITA_ETIQUETA {
        INTEGER receita_id PK, FK
        INTEGER etiqueta_id PK, FK
    }

    FAVORITO {
        INTEGER usuario_id PK, FK
        INTEGER receita_id PK, FK
    }

    USUARIO ||--o{ RECEITA : cria
    USUARIO ||--o{ FAVORITO : favorita

    RECEITA ||--o{ RECEITA_ETIQUETA : categorizada
    ETIQUETA ||--o{ RECEITA_ETIQUETA : categoriza
    RECEITA ||--o{ FAVORITO : favoritada