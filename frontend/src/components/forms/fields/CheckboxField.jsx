// One tick box with its text beside it (the label is the text).
export default function CheckboxField({ field, value, onChange, error, readOnly, className }) {
  return (
    <div className={`field ${error ? 'bad' : ''} ${className}`}>
      <label className="chk">
        <input type="checkbox" checked={!!value} disabled={readOnly} onChange={(e) => onChange(field.name, e.target.checked)} />
        <span>{field.label}</span>
      </label>
      <div className="err">{error}</div>
    </div>
  );
}
