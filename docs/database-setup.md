# Database setup (Windows)

This project uses PostgreSQL and Prisma. Define and change tables in
`backend/prisma/schema.prisma`, then apply changes with Prisma migrations. The
provided `pis_schema.sql` is a reference/alternative setup path; do not run it
against a database that you manage with Prisma migrations.

## 1. Install PostgreSQL

Install PostgreSQL 16 for Windows from
[postgresql.org/download/windows](https://www.postgresql.org/download/windows/).
Include PostgreSQL Server, pgAdmin 4, and Command Line Tools; keep port `5432`
and note the password you choose for the `postgres` account.

Open a new PowerShell window and check the command-line tools:

```powershell
psql --version
```

If `psql` is not recognized, add
`C:\Program Files\PostgreSQL\16\bin` to your Windows `Path`, then open a new
PowerShell window.

## 2. Create the application database

```powershell
psql -U postgres
```

At the `postgres=#` prompt, run:

```sql
CREATE DATABASE pis;
\q
```

Alternatively, create a database named `pis` in pgAdmin.

## 3. Configure the backend

From the repository root:

```powershell
Copy-Item backend\.env.example backend\.env
```

Edit `backend\.env` and set:

- `DATABASE_URL` to `postgresql://postgres:YOUR_PASSWORD@localhost:5432/pis`
- `JWT_SECRET` to a long, random value
- `PIS_ADMIN_EMAIL` to the initial administrator's email
- `PIS_ADMIN_PASSWORD` to a unique password of at least 12 characters

If the PostgreSQL password contains URL-reserved characters such as `@` or `#`,
URL-encode them (`@` as `%40`, `#` as `%23`). Keep `.env` local; it is ignored by
Git. The database seed hashes the administrator password with bcrypt.

## 4. Install packages and create the schema

Run commands from the `backend` directory:

```powershell
Set-Location backend
npm ci
npm run db:validate
npm run db:migrate
npm run db:generate
```

The migration creates the 13 tables from the guide and records the schema
change in `backend/prisma/migrations/`. Commit migration files with schema
changes so other developers can apply them.

## 5. Add starter data

Still in `backend/`, run:

```powershell
npm run db:seed
npm run db:seed:templates
```

`db:seed` inserts dropdown values and creates or updates the configured admin.
`db:seed:templates` loads the form and workflow JSON files under `shared/`.
Re-running the seeds is safe; the configured admin's password is reset to the
value in `PIS_ADMIN_PASSWORD`.

## 6. Check the database

```powershell
npm run db:studio
```

Prisma Studio opens a browser view of the tables. You can also use:

```powershell
psql -U postgres -d pis -c '\dt'
```

## Schema changes and troubleshooting

After editing `backend/prisma/schema.prisma`, run:

```powershell
npm run db:validate
npm run db:migrate -- --name describe_your_change
```

`P1001` usually means the PostgreSQL service is stopped or `DATABASE_URL` has the
wrong host/port. `P1000` means the database credentials are incorrect. If Prisma
reports that `DATABASE_URL` is missing, confirm the file is `backend\.env` and
that commands are being run from `backend\`.

The supplied SQL scripts are a separate alternative for inspecting or manually
creating the database. If you use `pis_schema.sql` and `pis_sample_data.sql`,
run the schema script first and do not also run Prisma's initial migration on
that same database.

## Application integration status

This sets up the schema and starter rows, but it does not yet switch the UI to
database-backed data. The frontend currently enables mocks by default, and the
backend's indent/action routes are still placeholders; the indent detail dialogs
are preview-only. The next implementation step is to add authenticated API
operations for indents and connect the frontend to them before disabling mocks.
