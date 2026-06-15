# Sunartn - Premium Luxury Artisan Marketplace Platform

Sunartn is a production-ready, enterprise-grade Artisan Marketplace Platform that connects artisans directly with global collectors. Designed with minimalist Aesop/Etsy/Apple-level aesthetics, it showcases heritage preservation and mindfulness in modern living.

## Project Structure

This monorepo consists of:
* **`frontend/`**: Next.js 15 app router built with TypeScript, Tailwind CSS, Zustand, and Framer Motion.
* **`backend/`**: NestJS REST API built with TypeScript, PostgreSQL database access via Prisma ORM, and Meilisearch sync.
* **`Screens/`**: Reference mockups for design guidance.

## Technologies Used

* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Zustand
* **Backend**: NestJS, Prisma 7, PostgreSQL, Meilisearch
* **AI Capabilities**: Gemini 1.5 Flash / OpenAI GPT-4o-mini custom modules
* **Deployment**: PM2 process manager, Nginx reverse proxy, and PostgreSQL on AWS EC2.

## How to Run Locally

### 1. Database Setup
Ensure PostgreSQL and Meilisearch are installed and running locally. Run the following in the `backend/` directory:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 2. Run NestJS Backend API
From the `backend/` directory:
```bash
npm run start
```
By default, the backend runs on `http://localhost:4000/api`.

### 3. Run Next.js Frontend
From the `frontend/` directory:
```bash
npm run dev
```
Open `http://localhost:3000` to browse the shop catalog, interact with the AI Concierge, design collections in AI Studio, and access user/artisan dashboards.

---

## AWS EC2 Deployment
Refer to the deployment instructions in the `backend/deploy_ec2.sh` script to set up PostgreSQL, Node.js, and Nginx on your AWS instance.
