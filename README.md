# Project – MERN Tax Filing Platform

 MERN-based web application for ITR & GST filing, built using React (Vite) for the frontend and Node.js + Express for the backend.

## Tech Stack

Frontend:
- React (Vite)
- React Router DOM
- Bootstrap
- Redux / Redux Saga

Backend:
- Node.js
- Express.js

Deployment:
- Frontend deployed on Vercel

## Project Structure

LedgerLine/
├── client/              # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   └── package.json
├── server/              # Backend (Node + Express)
├── vercel.json
├── README.md
└── package-lock.json

## Getting Started (For Team Members)

### Clone the Repository

git clone https://github.com/ADIB-AFSAR/LedgerLine.git
cd LedgerLine

### Frontend Setup

cd client
npm install
npm run dev

Frontend runs at:
http://localhost:5173

### Backend Setup

cd server
npm install
npm start

Backend runs at:
http://localhost:5000/

Make sure Node.js (v18 or above) is installed.

## Routing Guidelines

- React Router is used for navigation
- Do not use `<a href="/">`
 for internal routing
- Always use `<Link to="/login" />`

---

## Styling Guidelines

- Bootstrap is used for UI
- Prefer Bootstrap utility classes
- Avoid inline styles unless necessary

---

## Branching & Workflow

Create a new feature branch:
git checkout -b feature/your-feature-name

Commit changes:
git add .
git commit -m "Add: meaningful commit message"

Push branch:
git push origin feature/your-feature-name

Create a Pull Request to main.

---

## Important Notes

- Do not commit node_modules
- Do not change Vercel configuration without discussion
- Always pull latest main before starting work:
git pull origin main

---

## Live Application

https://taxproject-stg.vercel.app/
