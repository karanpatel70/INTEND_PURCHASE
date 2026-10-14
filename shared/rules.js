// Owner: Rahul (Manvendra reviews). Used by BOTH the frontend and the backend,
// so the checks are always identical. Plain JavaScript, no libraries.

// Should this field be shown? (looks at its "showIf" rule)
export function isVisible(field, values) {
  if (!field.showIf) return true;
  const { field: other, equals, in: list } = field.showIf;
  const v = values[other];
  if (equals !== undefined) return v === equals;
  if (list) return list.includes(v);
  return true;
}

const isEmpty = (v) =>
  v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0) || v === false;

// Checks one section of a form. Returns { fieldName: 'error text' } (empty object = all good).
export function validateSection(section, values) {
  const errors = {};
  for (const field of section.fields) {
    if (!isVisible(field, values)) continue;
    const v = values[field.name];

    if (field.type === 'items-table') {
      const rows = Array.isArray(v) ? v : [];
      const good = rows.filter((r) => field.columns.every((c) => !isEmpty(r[c.name])));
      if (field.required && good.length === 0) errors[field.name] = 'Add at least one complete item.';
      continue;
    }
    if (field.required && isEmpty(v)) {
      errors[field.name] = field.errorText || 'This field is required.';
      continue;
    }
    if (isEmpty(v)) continue;
    if (field.type === 'number') {
      const n = Number(v);
      if (Number.isNaN(n)) errors[field.name] = 'Enter a number.';
      else if (field.min !== undefined && n < field.min) errors[field.name] = `Must be at least ${field.min}.`;
      else if (field.max !== undefined && n > field.max) errors[field.name] = `Must be at most ${field.max}.`;
    }
  }
  return errors;
}

// Which limit rule applies? e.g. SPS-101 uses the "GeM" limit when gem = Yes.
export function limitRuleFor(template, values) {
  const l = template.limit;
  if (!l) return null;
  const answer = l.ruleBy ? values[l.ruleBy] : undefined;
  return (l.rules && answer && l.rules[answer]) || l.defaultRule;
}
