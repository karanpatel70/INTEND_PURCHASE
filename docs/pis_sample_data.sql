-- Optional starter rows so you can test. Run AFTER pis_schema.sql:
--   psql -U postgres -d pis -f pis_sample_data.sql
-- The password hash below is a PLACEHOLDER. Real hashes come from bcrypt in the backend seed.
INSERT INTO "ListItem" (list, value) VALUES
  ('department','Computer Science and Engineering'),
  ('department','Electrical Engineering'),
  ('department','Mechanical Engineering'),
  ('department','Information Technology'),
  ('budget_head','Departmental grant'),
  ('budget_head','Research project');

INSERT INTO "User" (name,email,"passwordHash",role,designation,"departmentId",status) VALUES
  ('Mr. Admin','admin@iitrpr.ac.in','REPLACE_WITH_BCRYPT_HASH','admin','Administrator',
     (SELECT id FROM "ListItem" WHERE value='Information Technology'),'active'),
  ('Dr. Rohit Mehra','rohit.mehra@iitrpr.ac.in',NULL,'indenter','Assistant Professor',
     (SELECT id FROM "ListItem" WHERE value='Computer Science and Engineering'),'pending');
