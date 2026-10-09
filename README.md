# HelpDesk

Aplicação com backend Express, TypeScript e Prisma e frontend React, TypeScript e Vite. O backend mantém a autenticação existente e agora inclui operações de chamados.

## Funcionalidades e rotas

- `POST /api/auth/login`: recebe `{ "email", "password" }` e devolve JWT e perfil público.
- `GET /api/auth/me`: devolve o perfil associado ao Bearer token.
- `GET /api/`: confirma que a API está respondendo.
- `GET /api/tickets`: lista os chamados do usuário; `ADMIN` pode consultar todos.
- `POST /api/tickets`: cria chamado para o usuário autenticado. Recebe `title` e `description`.
- `GET /api/tickets/:id`: consulta um chamado pertencente ao usuário; `ADMIN` pode consultar todos.
- `PATCH /api/tickets/:id/status`: altera status (`OPEN`, `IN_PROGRESS`, `RESOLVED`), permitido somente para `ADMIN`.

O CRUD de usuários permanece em `/api/users`, mas o cadastro público atual não aplica hash à senha nem atribui papéis de forma segura; por isso não é exposto no frontend.

## Requisitos e configuração

Use Node.js compatível com as dependências do projeto e PostgreSQL/PostGIS. Configure o arquivo raiz `.env` com valores locais (não publique credenciais):

```dotenv
DATABASE_URL="postgresql://usuario:senha@localhost:5432/helpdesk?schema=public"
JWT_SECRET="substitua-por-um-segredo-local"
JWT_EXPIRES_IN="3600"
PORT="3000"
```

O frontend pode usar `frontend/.env` com `VITE_API_URL=http://localhost:3000/api`. Sem essa variável, essa URL é o padrão.

## Executar

1. Inicie o PostgreSQL/PostGIS com `docker compose up -d postgres`.
2. Na raiz, execute `npm ci`, `npm run prisma:generate` e `npx prisma migrate deploy`.
3. Inicie o backend com `npm run dev`.
4. Em outro terminal, entre em `frontend`, execute `npm install` e `npm run dev`.
5. Acesse o endereço informado pelo Vite e entre com uma conta existente.

O fluxo de abertura, listagem e detalhes de chamados usa os dados persistidos no PostgreSQL. Os campos disponíveis são título, descrição, status, solicitante e datas; categoria e prioridade não fazem parte do schema.

## Permissões

Chamados são associados ao usuário autenticado no servidor. Usuários comuns só veem os próprios chamados. A alteração de status e a consulta geral exigem o papel `ADMIN`. Não há cadastro público seguro implementado.
