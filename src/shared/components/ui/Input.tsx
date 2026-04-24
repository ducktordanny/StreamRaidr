import type {InputHTMLAttributes} from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({className, ...props}: InputProps) {
  const cls = `input${className ? ` ${className}` : ''}`;
  return <input className={cls} {...props} />;
}
