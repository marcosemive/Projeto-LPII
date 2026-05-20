# Diagrama ER - Receitoteca

erDiagram

    CHEF {
        INTEGER id PK
        VARCHAR_100 nome
        VARCHAR_100 email
        VARCHAR_255 senha
    }

    USUARIO {
        INTEGER id PK
        VARCHAR_100 nome
        VARCHAR_100 email
        VARCHAR_255 senha
    }

    ETIQUETA {
        INTEGER id PK
        VARCHAR_50 nome
    }

    RECEITA {
        INTEGER id PK
        VARCHAR_255 img
        VARCHAR_100 title
        VARCHAR_50 time
        INTEGER servings
        INTEGER chef_id FK
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

    CHEF ||--o{ RECEITA : cria

    RECEITA ||--o{ RECEITA_ETIQUETA : categorizada
    ETIQUETA ||--o{ RECEITA_ETIQUETA : categoriza

    USUARIO ||--o{ FAVORITO : favorita
    RECEITA ||--o{ FAVORITO : favoritada