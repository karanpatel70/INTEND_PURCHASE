// Used by BOTH frontend and backend. A form field can name a calculator, e.g. "calc": "itemsTotal".
// A calculator is called as calc(values, ctx). values = answers so far, ctx = { user, lists }.
import { inr, presetDate, todayStr } from './utils.js';

export function itemsTotal(items = [], taxPercent = 0) {
  const subtotal = items.reduce((sum, r) => sum + (Number(r.qty) || 0) * (Number(r.rate) || 0), 0);
  const tax = Math.round(subtotal * Number(taxPercent || 0)) / 100;
  return { subtotal, tax, total: Math.round(subtotal + tax) };
}

export const calculators = {
  userName: (v, ctx) => ctx.user.name,
  userDeptDesig: (v, ctx) => {
    const { desig = '', dept = '' } = ctx.user;
    return desig.includes(dept) ? desig : [desig, dept].filter(Boolean).join(', ');
  },
  approxCost: (v) => inr(v.total),
  balance: (v) =>
    v.available === undefined || v.available === '' ? '' : inr(Number(v.available) - Number(v.booked || 0)),
  // returns undefined when the user picked a date by hand, so the typed date is kept
  deliveryText: (v) => (v.byPreset && v.byPreset !== 'Pick a date' ? 'Within ' + v.byPreset : undefined),
  deliveryDate: (v) =>
    v.byPreset && v.byPreset !== 'Pick a date' ? presetDate(v.date || todayStr(), v.byPreset) : undefined,
};
