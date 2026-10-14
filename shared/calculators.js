// Owner: Rahul (Manvendra reviews). Used by BOTH frontend and backend.
// A field can name a calculator, e.g. "calc": "itemsTotal".

export function itemsTotal(items = [], taxPercent = 0) {
  const subtotal = items.reduce((sum, r) => sum + (Number(r.qty) || 0) * (Number(r.rate) || 0), 0);
  const tax = Math.round(subtotal * Number(taxPercent || 0)) / 100;
  return { subtotal, tax, total: Math.round(subtotal + tax) };
}

export const calculators = { itemsTotal };
