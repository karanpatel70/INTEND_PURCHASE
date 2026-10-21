-- IIT Ropar Purchase Indent System - PostgreSQL schema (13 tables)
-- Run:  psql -U postgres -d pis -f pis_schema.sql
-- Note: with Prisma you normally use "prisma migrate dev" instead. Use this file
-- for a quick manual setup, for reading, or for pgAdmin's Query Tool.
-- This script is safe to re-run on an EMPTY database only (it drops nothing).

BEGIN;

-- ---------- Enums ----------
CREATE TYPE "Role" AS ENUM
  ('admin','registrar','hod','indenter','acc_top','acc_mid','acc_low','pur_top','pur_mid','pur_low');
CREATE TYPE "UserStatus" AS ENUM ('pending','active','blocked');

-- ---------- 1. ListItem: dropdown values (departments, budget heads, vendors ...) ----------
CREATE TABLE "ListItem" (
  id      SERIAL PRIMARY KEY,
  list    TEXT NOT NULL,            -- e.g. 'department', 'budget_head'
  value   TEXT NOT NULL,
  UNIQUE (list, value)
);

-- ---------- 2. User ----------
CREATE TABLE "User" (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  email          TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT,
  role           "Role" NOT NULL DEFAULT 'indenter',
  designation    TEXT,
  "departmentId" INTEGER REFERENCES "ListItem"(id) ON DELETE SET NULL,
  status         "UserStatus" NOT NULL DEFAULT 'pending',
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- 3. FormTemplate: form JSON per code + version ----------
CREATE TABLE "FormTemplate" (
  id             SERIAL PRIMARY KEY,
  code           TEXT NOT NULL,     -- e.g. 'SPS-101'
  version        INTEGER NOT NULL DEFAULT 1,
  name           TEXT NOT NULL,
  "workflowCode" TEXT NOT NULL,
  "limit"        JSONB,
  sections       JSONB NOT NULL,
  active         BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (code, version)
);

-- ---------- 4. WorkflowTemplate: stages and approvers ----------
CREATE TABLE "WorkflowTemplate" (
  id       SERIAL PRIMARY KEY,
  code     TEXT NOT NULL,
  version  INTEGER NOT NULL DEFAULT 1,
  steps    JSONB NOT NULL,
  UNIQUE (code, version)
);

-- ---------- 5. FormLimit: admin-set limits ----------
CREATE TABLE "FormLimit" (
  id              SERIAL PRIMARY KEY,
  "formCode"      TEXT NOT NULL,
  rule            TEXT NOT NULL,
  amount          DECIMAL(12,2) NOT NULL,
  "effectiveFrom" TIMESTAMP(3) NOT NULL,
  reason          TEXT,
  "createdById"   INTEGER NOT NULL REFERENCES "User"(id),
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "FormLimit_lookup" ON "FormLimit" ("formCode", rule, "effectiveFrom");

-- ---------- 6. Indent: one purchase indent ----------
CREATE TABLE "Indent" (
  id               SERIAL PRIMARY KEY,
  number           TEXT NOT NULL UNIQUE,         -- e.g. IND-2026-0136
  "formTemplateId" INTEGER NOT NULL REFERENCES "FormTemplate"(id),
  "workflowId"     INTEGER NOT NULL REFERENCES "WorkflowTemplate"(id),
  "createdById"    INTEGER NOT NULL REFERENCES "User"(id),
  "holderId"       INTEGER REFERENCES "User"(id), -- who must act now
  stage            TEXT NOT NULL,
  data             JSONB NOT NULL,               -- all form answers
  total            DECIMAL(12,2) NOT NULL,
  "limitApplied"   DECIMAL(12,2) NOT NULL,
  version          INTEGER NOT NULL DEFAULT 1,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Indent_holder" ON "Indent" ("holderId");
CREATE INDEX "Indent_creator" ON "Indent" ("createdById");

-- ---------- 7. IndentHistory: timeline of actions ----------
CREATE TABLE "IndentHistory" (
  id          SERIAL PRIMARY KEY,
  "indentId"  INTEGER NOT NULL REFERENCES "Indent"(id) ON DELETE CASCADE,
  "actorId"   INTEGER NOT NULL REFERENCES "User"(id),
  action      TEXT NOT NULL,        -- submit, approve, reject, return ...
  "fromStage" TEXT NOT NULL,
  "toStage"   TEXT NOT NULL,
  remark      TEXT,
  at          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "IndentHistory_indent" ON "IndentHistory" ("indentId");

-- ---------- 8. PurchaseOrder ----------
CREATE TABLE "PurchaseOrder" (
  id          SERIAL PRIMARY KEY,
  "indentId"  INTEGER NOT NULL UNIQUE REFERENCES "Indent"(id) ON DELETE CASCADE,
  "poNumber"  TEXT NOT NULL UNIQUE,
  vendor      TEXT NOT NULL,
  "orderDate" TIMESTAMP(3) NOT NULL,
  "dueDate"   TIMESTAMP(3) NOT NULL,
  status      TEXT NOT NULL DEFAULT 'ongoing',  -- ongoing, delivered, cancelled
  data        JSONB
);

-- ---------- 9. ApprovalAuthority: who may approve up to what amount ----------
CREATE TABLE "ApprovalAuthority" (
  id         SERIAL PRIMARY KEY,
  "userId"   INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "formCode" TEXT NOT NULL,
  "maxAmount" DECIMAL(12,2) NOT NULL,
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE ("userId", "formCode")
);

-- ---------- 10. Attachment: uploaded files ----------
CREATE TABLE "Attachment" (
  id           SERIAL PRIMARY KEY,
  "indentId"   INTEGER NOT NULL REFERENCES "Indent"(id) ON DELETE CASCADE,
  "fileName"   TEXT NOT NULL,
  "filePath"   TEXT NOT NULL,
  "sizeBytes"  INTEGER,
  "uploadedById" INTEGER NOT NULL REFERENCES "User"(id),
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Attachment_indent" ON "Attachment" ("indentId");

-- ---------- 11. PoExtension: delivery extension requests ----------
CREATE TABLE "PoExtension" (
  id            SERIAL PRIMARY KEY,
  "orderId"     INTEGER NOT NULL REFERENCES "PurchaseOrder"(id) ON DELETE CASCADE,
  "oldDueDate"  TIMESTAMP(3) NOT NULL,
  "newDueDate"  TIMESTAMP(3) NOT NULL,
  reason        TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending',  -- pending, approved, rejected
  "requestedById" INTEGER NOT NULL REFERENCES "User"(id),
  "decidedById"   INTEGER REFERENCES "User"(id),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- 12. Reminder: scheduled emails (node-cron reads this) ----------
CREATE TABLE "Reminder" (
  id         SERIAL PRIMARY KEY,
  "userId"   INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "indentId" INTEGER REFERENCES "Indent"(id) ON DELETE CASCADE,
  "orderId"  INTEGER REFERENCES "PurchaseOrder"(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL,                 -- pending_action, po_due ...
  "sendAt"   TIMESTAMP(3) NOT NULL,
  "sentAt"   TIMESTAMP(3)
);
CREATE INDEX "Reminder_due" ON "Reminder" ("sendAt") WHERE "sentAt" IS NULL;

-- ---------- 13. AuditLog: admin and security actions ----------
CREATE TABLE "AuditLog" (
  id        SERIAL PRIMARY KEY,
  "actorId" INTEGER REFERENCES "User"(id) ON DELETE SET NULL,
  action    TEXT NOT NULL,                  -- login, user_authorised, limit_changed ...
  target    TEXT,
  detail    JSONB,
  at        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
