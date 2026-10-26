// Used by BOTH frontend and backend. Works out the progress of a purchase order from its dates.
import { todayStr, daysBetween } from './utils.js';

// order = { stage, date, byDate, order: { status } }.  Returns { k, lbl, chip, pct, left }
export function ordInfo(o) {
  if (o.stage !== 'DONE') return { k: 'prep', lbl: 'PO being prepared', chip: 'c-gray', pct: 10 };
  const status = o.order && o.order.status;
  if (status === 'cancelled') return { k: 'cancel', lbl: 'Cancelled', chip: 'c-red', pct: 100 };
  if (status === 'delivered') return { k: 'done', lbl: 'Delivered', chip: 'c-solidgreen', pct: 100 };
  const left = daysBetween(todayStr(), o.byDate);
  const total = Math.max(1, daysBetween(o.date, o.byDate));
  const elapsed = daysBetween(o.date, todayStr());
  if (left < 0) return { k: 'over', lbl: `Overdue by ${-left} day${-left > 1 ? 's' : ''}`, chip: 'c-red', pct: 100, left };
  return {
    k: 'open',
    lbl: left === 0 ? 'Due today' : `${left} day${left > 1 ? 's' : ''} left`,
    chip: left <= 3 ? 'c-amber' : 'c-blue',
    pct: Math.max(6, Math.min(100, Math.round((elapsed / total) * 100))),
    left,
  };
}
