import './Input.css';

function Input({
  label,
  error,
  helperText,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const inputId = id || name;
  
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
}

export default Input;
