# ZR System Backend

Backend do projeto ZR System, construído com Node.js, Express, TypeORM e PostgreSQL.

## Requisitos

- Node.js `22+`
- npm `10+`
- PostgreSQL `17+`

Opcional para desenvolvimento local:

- Docker
- Docker Compose

## Stack

- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- JWT
- Scalar para documentação da API

## Como Rodar em Desenvolvimento

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

### 3. Subir o banco de dados

Se quiser usar Docker:

```bash
docker compose up -d
```

Se for usar um PostgreSQL já instalado, garanta que:

- o banco exista
- as credenciais do `.env` estejam corretas
- a porta esteja acessível

### 4. Iniciar o projeto

```bash
npm run dev
```

Ao iniciar em desenvolvimento, a aplicação faz automaticamente:

- conexão com o banco
- execução das migrations pendentes
- seed do usuário administrador inicial
- seed das configurações padrão de `form-metadata`

## Scripts

### Desenvolvimento

```bash
npm run dev
```

Sobe a API com `tsx watch`.

### Build

```bash
npm run build
```

Compila o projeto TypeScript para `dist/`.

### Produção local

```bash
npm run start
```

Executa a versão compilada.

### TypeORM CLI

```bash
npm run typeorm
```

Executa a CLI do TypeORM usando o DataSource do projeto.

### Rodar migrations manualmente

```bash
npm run migration:run
```

Observação:

- normalmente isso não é necessário em desenvolvimento, porque o servidor já roda as migrations no bootstrap

### Reverter última migration

```bash
npm run migration:revert
```

### Gerar migration

```bash
npm run migration:generate
```

## Variáveis de Ambiente

Todas as variáveis atuais estão em [.env.example](/Users/pro/projetos/zrsystem/backend/.env.example).

### Aplicação

#### `NODE_ENV`

- Define o ambiente de execução da aplicação.
- Valores aceitos:
  - `development`
  - `test`
  - `production`
- Impacta especialmente o nível de log e comportamento de ambiente.

Exemplo:

```env
NODE_ENV=development
```

#### `PORT`

- Porta HTTP em que a API será exposta.

Exemplo:

```env
PORT=3000
```

#### `APP_HOST`

- Host usado no `listen` do servidor.
- Em desenvolvimento geralmente pode ficar como `0.0.0.0`.

Exemplo:

```env
APP_HOST=0.0.0.0
```

### Banco de Dados

#### `DATABASE_HOST`

- Host do PostgreSQL.

Exemplo:

```env
DATABASE_HOST=localhost
```

#### `DATABASE_PORT`

- Porta do PostgreSQL.

Exemplo:

```env
DATABASE_PORT=5432
```

#### `DATABASE_USERNAME`

- Usuário do banco.

Exemplo:

```env
DATABASE_USERNAME=postgres
```

#### `DATABASE_PASSWORD`

- Senha do usuário do banco.

Exemplo:

```env
DATABASE_PASSWORD=postgres
```

#### `DATABASE_NAME`

- Nome do banco utilizado pela aplicação.

Exemplo:

```env
DATABASE_NAME=zrsystem
```

### JWT

#### `JWT_ACCESS_SECRET`

- Chave secreta usada para assinar o access token.
- Deve ser forte e diferente da chave de refresh token.

Exemplo:

```env
JWT_ACCESS_SECRET=change-me-access-secret
```

#### `JWT_REFRESH_SECRET`

- Chave secreta usada para assinar o refresh token.
- Deve ser forte e diferente da chave de access token.

Exemplo:

```env
JWT_REFRESH_SECRET=change-me-refresh-secret
```

#### `JWT_ACCESS_EXPIRES_IN`

- Tempo de expiração do access token.
- Usa o formato aceito pelo `jsonwebtoken`, por exemplo:
  - `15m`
  - `1h`
  - `2d`

Exemplo:

```env
JWT_ACCESS_EXPIRES_IN=15m
```

#### `JWT_REFRESH_EXPIRES_IN`

- Tempo de expiração do refresh token.
- Também usa o formato aceito pelo `jsonwebtoken`.

Exemplo:

```env
JWT_REFRESH_EXPIRES_IN=7d
```

### Usuário Administrador Inicial

#### `ADMIN_USERNAME`

- Usuário seedado automaticamente no bootstrap caso ainda não exista.
- Usado para o primeiro login no sistema.

Exemplo:

```env
ADMIN_USERNAME=admin
```

#### `ADMIN_PASSWORD`

- Senha do usuário administrador inicial.
- É convertida em hash antes de ser persistida.

Exemplo:

```env
ADMIN_PASSWORD=admin123
```

## Banco com Docker

O projeto já possui [docker-compose.yml](/Users/pro/projetos/zrsystem/backend/docker-compose.yml).

Para subir:

```bash
docker compose up -d
```

Para derrubar:

```bash
docker compose down
```

Para derrubar removendo volume:

```bash
docker compose down -v
```

## Documentação da API

Depois de subir o projeto:

- OpenAPI JSON: `GET /openapi.json`
- Scalar UI: `GET /docs`

Exemplo local:

- `http://localhost:3000/openapi.json`
- `http://localhost:3000/docs`

## Usuário inicial

No primeiro bootstrap, o backend cria automaticamente um usuário administrador se ele ainda não existir.

Credenciais padrão do `.env.example`:

- usuário: `admin`
- senha: `admin123`

Se mudar os valores no `.env`, o seed passará a usar os novos valores.

## Observações importantes

- O servidor executa migrations automaticamente ao iniciar.
- O projeto também popula automaticamente as configurações iniciais de `form-metadata`.
- Se o banco estiver fora do ar ou as credenciais estiverem incorretas, a aplicação não sobe.
- A rota `/docs` depende de acesso ao CDN do Scalar no navegador.

## Estrutura principal do projeto

```text
src/
  main/
  modules/
    auth/
    customers/
    form-metadata/
  database/
  shared/
```

## Módulos atuais

### `auth`

- login
- refresh token
- usuário autenticado

### `customers`

- CRUD de clientes PF/PJ
- busca por nome/CPF/CNPJ
- responsáveis vinculados ao cliente PJ

### `form-metadata`

- leitura da configuração do formulário
- atualização da configuração de campos do formulário de clientes
- seed inicial de metadados
