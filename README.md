# Seleção de Achados

Plataforma de curadoria de produtos com achados da internet.

**Deploy:** [https://www.selecaodeachados.com](https://www.selecaodeachados.com)

## Tecnologias utilizadas

| React | Java | Spring Boot | PostgreSQL | Docker |
|-------|------|-------------|------------|--------|

## Serviços utilizados

| Vercel | Render | Supabase | Namecheap |
|--------|--------|----------|-----------|

## Pré-requisitos

Você precisa ter instalado na sua máquina:

- **Docker** — [Baixar aqui](https://docs.docker.com/get-docker/)
- **Git** — [Baixar aqui](https://git-scm.com/)

Não precisa instalar Java, Node.js, PostgreSQL ou qualquer outra coisa. O Docker cuida de tudo.

---

## Como rodar o projeto (passo a passo)

### 1. Baixar o repositório

Abra o terminal e digite:

```bash
git clone <url-do-repositorio>
cd SelecaoDeAchados
```

### 2. Criar o arquivo de configuração

No terminal, copie o arquivo `.env.example` como `.env`:

**Linux / Mac:**
```bash
cp .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

### 3. Preencher as variáveis de ambiente

Abra o arquivo `.env` que acabou de criar em qualquer editor de texto e preencha:

| Variável | O que é | Exemplo |
|---|---|---|
| `POSTGRES_PASSWORD` | Senha do banco de dados local | `minha-senha-123` |
| `JWT_SECRET` | Texto aleatório usado para gerar tokens de segurança. Pode ser qualquer coisa com no mínimo 32 caracteres. | `minha-chave-super-segura-para-token-12345` |
| `ADMIN_EMAIL` | Email para acessar o painel admin | `admin@meusite.com` |
| `ADMIN_PASSWORD` | Senha do admin | `admin123` |
| `SUPABASE_URL` | (Opcional) URL do seu projeto Supabase para upload de imagens. Se não preencher, funciona apenas colando URLs de imagens. | Deixe em branco se não for usar |
| `SUPABASE_SERVICE_ROLE_KEY` | (Opcional) Chave do Supabase. | Deixe em branco se não for usar |

Exemplo de como vai ficar:

```env
ADMIN_EMAIL=admin@meusite.com
ADMIN_PASSWORD=admin123

POSTGRES_DB=selecao_de_achados
POSTGRES_USER=postgres
POSTGRES_PASSWORD=minha-senha-123

JWT_SECRET=minha-chave-super-segura-para-token-12345
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

### 4. Subir a aplicação

No terminal, execute:

```bash
docker compose up
```

Na primeira vez vai demorar alguns minutos baixando as imagens e compilando o código. Nas próximas vezes será mais rápido.

### 5. Acessar

Com a aplicação rodando, abra o navegador:

| O quê | URL |
|---|---|
| Site principal | http://localhost:5173 |
| Painel admin | http://localhost:5173/admin |
| API | http://localhost:8080 |

Para acessar o admin, use o email e senha que você colocou no `.env`.

### 6. Parar a aplicação

No terminal onde está rodando, pressione `Ctrl + C`. Ou em outro terminal:

```bash
docker compose down
```

Para parar **e apagar os dados do banco** (começar do zero):

```bash
docker compose down -v
```

---

## Dados iniciais

Ao subir pela primeira vez, as categorias são criadas automaticamente no banco. Os produtos você cadastra manualmente pelo painel admin.

---

## Sobre as imagens dos produtos

O sistema permite duas formas de adicionar imagem ao produto:

1. **URL da web** (recomendado): clique com o botão direito em uma imagem do Google, copie o endereço da imagem e cole no campo "Ou cole a URL da imagem"
2. **Upload**: funciona apenas se você configurar o Supabase (explicado abaixo)

### Configurar Supabase (para upload de imagens)

Se quiser habilitar o upload de imagens:

1. Crie uma conta gratuita em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **Storage** e crie um bucket público chamado `produtos`
4. Vá em **Project Settings > API** e copie:
   - `Project URL` → coloque em `SUPABASE_URL` no `.env`
   - `service_role key` → coloque em `SUPABASE_SERVICE_ROLE_KEY` no `.env`
   - `anon public key` → coloque em `VITE_SUPABASE_ANON_KEY` no arquivo `Client/.env`
   - `Project URL` (mesmo) → coloque em `VITE_SUPABASE_URL` no arquivo `Client/.env`

Depois reinicie a aplicação com `docker compose up --build`.

---

## Estrutura do projeto

```
SelecaoDeAchados/
├── Server/              # Backend (Java / Spring Boot)
│   ├── src/
│   └── Dockerfile
├── Client/              # Frontend (React / Vite)
│   ├── src/
│   └── Dockerfile
├── scripts/             # Scripts auxiliares
├── docker-compose.yml   # Configuração dos containers
├── .env.example         # Modelo do arquivo de ambiente
└── README.md
```
