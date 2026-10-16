import Field from '../../ui/Field.jsx';
import Icon from '../../ui/Icon.jsx';

// Pill buttons, pick one. If the field has "hints", the hint for the chosen answer is shown below.
export default function RadioField({ field, value, onChange, error, readOnly, className }) {
  const hint = field.hints && field.hints[value];
  return (
    <Field label={field.label} error={error} required={field.required} className={className}>
      <div className="opts" role="radiogroup">
        {field.options.map((o) => (
          <label key={o} className="opt">
            <input type="radio" name={field.name} value={o} checked={value === o} disabled={readOnly} onChange={() => onChange(field.name, o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {hint && !readOnly && (
        <div className="alert info hintbox"><Icon name="info" size={18} /><span>{hint}</span></div>
      )}
    </Field>
  );
}
