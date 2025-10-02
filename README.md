# Case Fullstack - Node + React

Este projeto foi desenvolvido como parte do processo seletivo **Dev Jr Fullstack (Node + React)**.  
O objetivo foi implementar um backend completo em **Node.js + Fastify + Prisma** e criar uma tela de projeção financeira no frontend em **Next.js + React**.

---

## 🚀 Tecnologias utilizadas
- **Backend**
  - Node.js
  - Fastify
  - Prisma ORM
  - Swagger (documentação)
  - Docker

- **Frontend**
  - Next.js 14
  - React
  - TailwindCSS
  - Recharts

---

## ⚙️ Funcionalidades
- **Backend**
  - CRUD de simulações
  - CRUD de alocações
  - CRUD de movimentações
  - CRUD de seguros
  - Endpoint `/simulations/projections` para gerar projeções financeiras

- **Frontend**
  - Página de projeção patrimonial
  - Formulário para rodar simulação (`simulationId` e `realRate`)
  - Gráfico com evolução financeira, imóveis e total
  - Timeline
  - Cards de movimentações e seguros
  - Estilo dark responsivo

---

## 📦 Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seuusuario/case-fullstack-node-react.git
cd case-fullstack-node-react
```


### 2. Rodar o backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 3. Rodar o Frontend
```bash
cd frontend
npm install
npm run dev
```




