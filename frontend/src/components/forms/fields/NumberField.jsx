import Field from '../../ui/Field.jsx';

export default function NumberField({ field, value, onChange, error, readOnly, className }) {
  return (
    <Field label={field.label} error={error} required={field.required} className={className}>
      <input
        className="inp" type="number" min={field.min} value={value ?? ''} placeholder={readOnly ? '' : field.placeholder} disabled={readOnly}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    </Field>
  );
}
