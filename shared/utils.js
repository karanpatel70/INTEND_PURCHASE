// Used by BOTH frontend and backend. Money and date helpers, plain JavaScript.

export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

// "2026-10-07" -> "07.10.2026"
export const dstr = (s) => {
  const m = String(s || '').match(/^(\d{4})-(\d\d)-(\d\d)/);
  return m ? `${m[3]}.${m[2]}.${m[1]}` : String(s || '');
};

const pad2 = (n) => String(n).padStart(2, '0');
export const ymd = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
export const todayStr = () => ymd(new Date());

export const addDays = (iso, n) => {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return ymd(d);
};
export const addMonths = (iso, n) => {
  const d = new Date(iso + 'T00:00:00');
  d.setMonth(d.getMonth() + n);
  return ymd(d);
};
export const daysBetween = (a, b) =>
  Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5);

// "3 weeks" from a base date -> new date
export const presetDate = (base, preset) => {
  const m = String(preset).match(/^(\d+) (week|month)/);
  if (!m) return base;
  return m[2] === 'week' ? addDays(base, 7 * +m[1]) : addMonths(base, +m[1]);
};

// "3 weeks from PO" -> "3 weeks"
export const guessPreset = (text) => {
  const m = String(text || '').match(/(\d+)\s*(week|month)/i);
  if (!m) return '3 weeks';
  return m[1] + ' ' + m[2].toLowerCase() + (+m[1] > 1 ? 's' : '');
};

// Full date and time, e.g. "07 Oct 2026, 11:00"
export const fmtDateTime = (d) =>
  new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  });
