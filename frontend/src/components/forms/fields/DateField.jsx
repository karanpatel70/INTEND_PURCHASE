import Field from '../../ui/Field.jsx';

export default function DateField({ field, value, onChange, error, readOnly, className }) {
  return (
    <Field label={field.label} error={error} required={field.required} className={className}>
      <input className="inp" type="date" value={value ?? ''} disabled={readOnly} onChange={(e) => onChange(field.name, e.target.value)} />
    </Field>
  );
}
