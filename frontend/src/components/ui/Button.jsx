import './Button.css';

function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props 
}) {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn-spinner"></span>
          {children}
        </>
      ) : children}
    </button>
  );
}

export default Button;
