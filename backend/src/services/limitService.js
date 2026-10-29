import { prisma } from '../config/prisma.js';

export async function getCurrentLimit(formCode, rule, date = new Date()) {
  const row = await prisma.formLimit.findFirst({
    where: { formCode, rule, effectiveFrom: { lte: date } },
    orderBy: [{ effectiveFrom: 'desc' }, { id: 'desc' }],
  });
  return row ? Number(row.amount) : null;
}

// One row per form + rule (the one in force today). Same shape as src/mocks/limits.js.
export async function listCurrentLimits() {
  const rows = await prisma.formLimit.findMany({
    where: { effectiveFrom: { lte: new Date() } },
    orderBy: [{ effectiveFrom: 'desc' }, { id: 'desc' }],
  });
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const key = r.formCode + '|' + r.rule;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ formCode: r.formCode, rule: r.rule, amount: Number(r.amount), effectiveFrom: r.effectiveFrom.toISOString().slice(0, 10) });
  }
  return out;
}

export async function addLimit({ formCode, rule, amount, reason, effectiveFrom }, userId) {
  return prisma.formLimit.create({
    data: {
      formCode,
      rule,
      amount,
      reason: reason || null,
      effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : new Date(),
      createdById: Number(userId),
    },
  });
}