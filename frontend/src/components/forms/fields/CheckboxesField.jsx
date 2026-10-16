import Field from '../../ui/Field.jsx';

// Pill buttons, pick any number. The answer is a list, e.g. ["E-mail", "GeM"].
export default function CheckboxesField({ field, value, onChange, error, readOnly, className }) {
  const chosen = value || [];
  const toggle = (o) => onChange(field.name, chosen.includes(o) ? chosen.filter((x) => x !== o) : [...chosen, o]);
  return (
    <Field label={field.label} error={error} required={field.required} className={className}>
      <div className="opts">
        {field.options.map((o) => (
          <label key={o} className="opt">
            <input type="checkbox" checked={chosen.includes(o)} disabled={readOnly} onChange={() => toggle(o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </Field>
  );
}
