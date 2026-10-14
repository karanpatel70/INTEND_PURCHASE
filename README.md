# Purchase Indent System - IIT Ropar

Folders:
- frontend/   React + Vite + Tailwind (Rahul, Manvendra, Sujeet)
- backend/    Node + Express + Prisma (Karan, Manvendra; Sujeet = email; Rahul = reports/uploads)
- shared/     form + workflow JSON files and the rules used by BOTH frontend and backend
- docs/       notes, API contract, form template format

## Adding a new form
See docs/form-template-format.md (add a JSON file in shared/forms/, then `npm run db:seed:templates`).

## Run it (after cloning)
1. Database: install PostgreSQL, create a database called `pis` (see the team guide).
2. Backend:  cd backend && cp .env.example .env && npm install && npm run dev   -> http://localhost:4000/api/health
3. Frontend: cd frontend && cp .env.example .env && npm install && npm run dev  -> http://localhost:5173
