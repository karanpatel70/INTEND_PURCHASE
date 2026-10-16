import Field from '../../ui/Field.jsx';

// Owner: Rahul. Every field component gets the same props: field, value, onChange, error, readOnly, className, ctx.
export default function TextField({ field, value, onChange, error, readOnly, className }) {
  return (
    <Field label={field.label} error={error} required={field.required} className={className}>
      <input
        className="inp" value={value ?? ''} placeholder={readOnly ? '' : field.placeholder} disabled={readOnly}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    </Field>
  );
}
