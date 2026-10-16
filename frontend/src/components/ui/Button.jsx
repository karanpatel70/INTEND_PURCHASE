import Icon from './Icon.jsx';

export default function Button({ variant = '', size = '', icon, className = '', children, ...rest }) {
  return (
    <button type="button" className={`btn ${variant} ${size} ${className}`.trim()} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}
