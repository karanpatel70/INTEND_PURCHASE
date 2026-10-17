# shared/

Everything here is used by BOTH frontend and backend.

- forms/      one JSON file per form (SPS-101.json ...). This is the source of truth.
- workflows/  one JSON file per approval flow.
- rules.js    field visibility, validation, which limit rule applies.
- calculators.js  totals and tax.

Adding a form = add a JSON file here, then run `npm run db:seed:templates` in backend/.
Format: see docs/form-template-format.md

Also here: utils.js (money and date helpers), roles.js, workflow.js (buttons and stages), orders.js (order status).
In the frontend these are imported as `@shared/...` (the alias is set in frontend/vite.config.js).
