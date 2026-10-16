import Field from '../../ui/Field.jsx';
import { calculators } from '@shared/calculators.js';

// A read-only box whose text is worked out by a calculator (field.calc), e.g. "Balance budget".
// A full-width display field is drawn as a grey bar.
export default function DisplayField({ field, values, className, ctx }) {
  const text = calculators[field.calc](values, ctx);
  if (field.width === 'full') {
    return (
      <div className={`bal ${className}`}>
        <span>{field.label}</span>
        <span className="tnum" style={{ color: text && String(text).startsWith('₹-') ? 'var(--red)' : '' }}>{text || field.hint}</span>
      </div>
    );
  }
  return (
    <Field label={field.label} hint={field.hint} className={className}>
      <input className="inp" readOnly value={text} />
    </Field>
  );
}
