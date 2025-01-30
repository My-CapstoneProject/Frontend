import './Input.css';

export const Input = ({ 
  label,
  error,
  helperText,
  fullWidth,
  ...props 
}) => {
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full' : ''}`}>
      {label && <label className="input-label">{label}</label>}
      <input 
        className={`input-field ${error ? 'input-error' : ''}`}
        {...props}
      />
      {helperText && (
        <span className={`input-helper ${error ? 'helper-error' : ''}`}>
          {helperText}
        </span>
      )}
    </div>
  );
}; 