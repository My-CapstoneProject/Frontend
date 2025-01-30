import './Card.css';

export const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`card card-${variant} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}; 