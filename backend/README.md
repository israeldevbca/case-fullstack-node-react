# Planner Backend (Node + Fastify + Prisma)

## Rodar com Docker
```bash
docker compose up -d --build
# aplica schema sem migrações e popula dados de exemplo
docker compose exec api npx prisma db push
docker compose exec api npm run seed
# Docs Swagger
# http://localhost:3001/docs
```
