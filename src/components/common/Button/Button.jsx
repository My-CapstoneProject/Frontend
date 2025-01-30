import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon,
  fullWidth,
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}; 