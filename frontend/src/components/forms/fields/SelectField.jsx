import Field from '../../ui/Field.jsx';

// The choices come from field.options, or from an admin dropdown list (field.optionsFrom, e.g. "budgetHead").
export default function SelectField({ field, value, onChange, error, readOnly, className, ctx }) {
  const choices = [...(field.options || ctx.lists[field.optionsFrom] || []), ...(field.extraOptions || [])];
  return (
    <Field label={field.label} error={error} required={field.required} className={className}>
      <select className="sel" value={value ?? ''} disabled={readOnly} onChange={(e) => onChange(field.name, e.target.value)}>
        {field.placeholder && <option value="">{field.placeholder}</option>}
        {choices.map((c) => <option key={c}>{c}</option>)}
      </select>
    </Field>
  );
}
