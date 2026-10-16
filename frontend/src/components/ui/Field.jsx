
export default function Field({ label, error, required, hint, children, className = '', htmlFor }) {
  return (
    <div className={`field ${error ? 'bad' : ''} ${className}`.trim()}>
      {label && (
        <label className={`lbl ${required ? 'req' : ''}`} htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {hint && <div className="xs muted">{hint}</div>}
      <div className="err">{error}</div>
    </div>
  );
}
