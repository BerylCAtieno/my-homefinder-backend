# 🏡 MyHomeFinder Backend

The backend for **MyHomeFinder**, a real estate listing platform that connects property seekers with verified listings. Built with **Node.js**, **Express**, and **TypeScript**, this API powers user authentication, property management, and search capabilities.  

---

## 🧠 Overview

**MyHomeFinder** aims to simplify how users discover and manage properties. The backend provides secure and scalable endpoints for user registration, login, property listing, and admin operations — ready for frontend integration.

---

## 🎯 MVP Scope

The MVP backend includes:

- RESTful API endpoints for:
  - User authentication (register/login) for both the users and landlords
  - CRUD for property listings
- Middleware for validation and error handling
- Basic environment config
- TypeScript structure with `tsconfig`
- `.env` and configuration setup

---

## 🚧 Current State

- [x] Project scaffolded with Express + TypeScript
- [x] Basic folder structure (`src/`)
- [ ] Authentication routes
- [ ] Property listing routes
- [x] PostgreSQL setup
- [ ] Validation middleware
- [ ] API documentation (Swagger/Postman)

---

## 🧱 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **Dotenv**
- **Nodemon + ts-node-dev**
- **PostgreSQL** (via Prisma)
- **Joi/Zod** for validation (planned)

---

## 🧪 Setup & Development

```bash
# Clone the repo
git clone https://github.com/Techies-Collab-and-Upskill-Live-Project/my-homefinder-backend.git
cd my-homefinder-backend

# Install dependencies
npm install

# Database Migration
npx prisma migrate dev

# Start development server
npm run dev

```

---

## 
