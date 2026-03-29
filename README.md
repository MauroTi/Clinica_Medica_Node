# Clinica_Medica_Node

Backend para o projeto Clinica Medica.

## Requisitos
- Node.js 18+ (recomendado 24)
- MySQL (ou MariaDB)

## Instalação

1. `cd c:\xampp\htdocs\Node\clinica_medica_node`
2. `npm install`

## Configuração de ambiente

- Renomeie `.env.example` (se existir) para `.env`
- Defina as variáveis:
  - `DB_HOST`
  - `DB_USER`
  - `DB_PASS`
  - `DB_NAME`
  - `PORT` (opcional; padrão 3000)

## Seed (dados iniciais)

`npm run seed`

## Executar

`npm start`

### Desenvolvimento

`npm run dev`

## Testes Automatizados

Este backend não possui testes Jest definidos (ainda). Você pode testar manualmente com API endpoints e ferramentas como Postman.

## API

- `/api/pacientes`
- `/api/medicos`
- `/api/consultas`

Front-end pode ser servido via `app.use(express.static(path.join(__dirname, 'frontend')))`.

## Observação

Se receber erro `EADDRINUSE`, verifique se já existe servidor rodando na porta padrão. Ajuste `PORT` em `.env`.
