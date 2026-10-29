import { prisma } from '../config/prisma.js';
import { HttpError } from '../middleware/errorHandler.js';
import { validateSection, withTotals, limitRuleFor } from '../../../shared/rules.js';
import { getCurrentLimit } from './limitService.js';
import { inr } from '../../../shared/utils.js';

//Turn a database row into the object.
function toApiForm(row) {
  return {
    code: row.code,
    version: row.version,
    name: row.name,
    note: row.note,
    workflowCode: row.workflowCode,
    limit: row.limit,
    printLayout: row.printLayout,
    sections: row.sections,
  };
}

//Get the newest active version of one form.
export async function getFormRow(code) {
  return prisma.formTemplate.findFirst({
    where: { code, active: true },
    orderBy: { version: 'desc' },
  });
}

export async function getForm(code) {
  const row = await getFormRow(code);
  if (!row) return null;
  return toApiForm(row);
}

//List all forms, only the newest version of each.
export async function listForms() {

  const rows = await prisma.formTemplate.findMany({
    where: { active: true },
    orderBy: [{ code: 'asc' }, { version: 'desc' }],
  });

  const newest = {};
  for (const row of rows) {
    if (!newest[row.code]) newest[row.code] = row; //keep the first one only among all code:version
  }
  return Object.values(newest).map(toApiForm);
}

// Check the Indenter section.
export async function checkIndenter(template, values, strict) {
  const section = template.sections.find((s) => s.key === 'indenter');

  //work out the total again
  const full = withTotals(section, values || {});
  const total = Number(full.total) || 0;

  //find the price limit that applies to this form
  let limitApplied = 0;
  const rule = limitRuleFor(template, full);
  if (rule) {
    limitApplied = (await getCurrentLimit(template.code, rule)) || 0;
  }

  //Draft does not require strcit checks
  if (!strict) {
    return { values: full, total, limitApplied };
  }

  //Every field must be valid
  const errors = validateSection(section, full);
  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Please fix the highlighted fields.', { fields: errors });
  }

  //The amount must not be above the limit
  const amountField = template.limit?.amountField || 'total';
  const amount = Number(full[amountField]) || 0;
  if (limitApplied && amount > limitApplied) {
    throw new HttpError(400, `The total ${inr(amount)} is above the ${inr(limitApplied)} limit of this form. Use the form for bigger purchases.`);
  }

  return { values: full, total, limitApplied };
}

// Check one later section (accounts, purchase, po) filled by an approver.
export function checkSection(template, key, values) {
  const section = template.sections.find((s) => s.key === key);
  if (!section) throw new HttpError(400, 'Unknown section.');

  const full = withTotals(section, values || {});
  const errors = validateSection(section, full);
  if (Object.keys(errors).length > 0) {
    throw new HttpError(400, 'Please fix the highlighted fields.', { fields: errors });
  }
  return full;
}