import { useEffect, useState } from 'react';
import { getLimits } from '../api/forms.js';
import { limitRuleFor } from '@shared/rules.js';

// Owner: Rahul. Loads the limits in force now. limitFor(template, values) gives { rule, amount } for the
// answers entered so far, e.g. SPS-101 with GeM = Yes -> { rule: 'GeM', amount: 50000 }.
export function useLimits() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    getLimits().then(setRows).catch(() => {});
  }, []);

  function limitFor(template, values) {
    const rule = limitRuleFor(template, values);
    const row = rows.find((r) => r.formCode === template.code && r.rule === rule);
    return { rule, amount: row ? row.amount : Infinity };
  }
  return { rows, limitFor };
}
