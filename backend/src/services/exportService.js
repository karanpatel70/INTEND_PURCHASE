const cell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(rows, columns) {
  const head = columns.map((c) => cell(c.label)).join(',');
  const lines = rows.map((r) => columns.map((c) => cell(r[c.key])).join(','));
  return '﻿' + [head, ...lines].join('\r\n'); // the first character lets Excel read ₹ and accents
}
