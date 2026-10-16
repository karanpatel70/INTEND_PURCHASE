import { stages } from '@shared/workflow.js';

export function Chip({ tone = 'gray', className = '', children }) {
  return <span className={`chip c-${tone} ${className}`.trim()}>{children}</span>;
}

// The coloured stage label of an indent (name and colour come from shared/workflows/standard.json).
export default function StatusChip({ stage }) {
  const st = stages[stage];
  return <span className={`chip ${st.chip}`}>{st.label}</span>;
}
