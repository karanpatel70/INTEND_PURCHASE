# Form template format (version 1)

One JSON file per form in `shared/forms/`. The frontend draws the form from it and the backend validates answers with it.

## Top level
| key | meaning |
|---|---|
| code | form code, e.g. `SPS-101` |
| version | whole number. Change it when fields change, so old indents keep their old layout |
| name | title shown in the dropdown |
| workflowCode | which file in `shared/workflows/` this form follows |
| limit | which price limit applies (see below). Optional |
| sections | list of sections, in order |

## Section
`{ "key": "indenter", "title": "...", "filledBy": "indenter", "fields": [ ... ] }`
`filledBy` says who fills it: `indenter`, `accounts` or `purchase`.

## Field
| key | meaning |
|---|---|
| name | key in the saved answers (`Indent.data`). No spaces |
| label | text shown to the user |
| type | one of the types below |
| required | `true` = must be filled |
| min / max | for `number` |
| options | list of choices for `select`, `radio`, `checkboxes` |
| optionsFrom | load choices from an admin dropdown list, e.g. `budgetHead` |
| showIf | `{ "field": "gem", "equals": "No" }` show only when that answer matches |
| placeholder, default, errorText | small helpers |

## Field types (version 1)
`text`, `number`, `textarea`, `select`, `radio`, `checkboxes`, `checkbox`, `date`, `items-table`, `file`

`items-table` extra keys: `columns` (name, label, type), `taxField`, `defaultTax`, `calc` (name of a function in `shared/calculators.js`), `totalField`.

## Limit
`"limit": { "amountField": "total", "ruleBy": "gem", "rules": { "Yes": "GeM", "No": "non-GeM" }, "defaultRule": "non-GeM" }`
The rule name (`GeM`, `non-GeM`, `all`) is looked up in the `FormLimit` table. The admin changes the amount there, not in this file.

## Add a new form
1. Copy `SPS-101.json` to `SPS-103.json`. Change code, name, sections, fields.
2. In `backend/` run `npm run db:seed:templates`.
3. Open Create indent. The new form is in the dropdown.
4. Only if you need a new field type: add one component in `frontend/src/components/forms/fields/` and one line in `fieldRegistry.js`.
