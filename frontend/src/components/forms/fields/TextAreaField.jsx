import Field from '../../ui/Field.jsx';

export default function TextAreaField({ field, value, onChange, error, readOnly, className }) {
  return (
    <Field label={field.label} error={error} required={field.required} className={className}>
      <textarea
        className="txt" value={value ?? ''} placeholder={readOnly ? '' : field.placeholder} disabled={readOnly}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    </Field>
  );
}
