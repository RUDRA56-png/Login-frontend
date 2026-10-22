export default function Field({ label, name, type = 'text', value, onChange, error, hint, ...rest }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={error ? 'invalid' : ''}
        aria-invalid={!!error}
        {...rest}
      />
      {error ? <span className="error-text">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}
