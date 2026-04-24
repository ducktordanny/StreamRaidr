import type {ButtonHTMLAttributes} from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({variant = 'primary', className, ...props}: ButtonProps) {
  const cls = `btn btn-${variant}${className ? ` ${className}` : ''}`;
  return <button className={cls} {...props} />;
}
