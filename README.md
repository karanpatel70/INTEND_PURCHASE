# Purchase Indent System - IIT Ropar
Frontend-16 October

Folders:
- frontend/   React + Vite + Tailwind (Rahul, Manvendra, Sujeet)
- backend/    Node + Express + Prisma (Karan, Manvendra; Sujeet = email; Rahul = reports/uploads)
- shared/     form + workflow JSON files and the rules used by BOTH frontend and backend
- docs/       notes, API contract, form template format

## Adding a new form
See docs/form-template-format.md (add a JSON file in shared/forms/, then `npm run db:seed:templates`).

## Run it (after cloning)
1. Set up PostgreSQL, the backend environment, schema and seed data using [docs/database-setup.md](./docs/database-setup.md).
2. Backend: from `backend/`, run `npm ci` and `npm run dev` -> http://localhost:4000/api/health
3. Frontend: from `frontend/`, copy `.env.example` to `.env`, run `npm install` and `npm run dev` -> http://localhost:5173