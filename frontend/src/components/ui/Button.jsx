import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  className = '',
  isLoading = false,
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: `
      bg-gradient-to-r from-brand-600 to-brand-500 text-white px-5 py-2.5
      shadow-lg shadow-brand-600/30
      hover:shadow-brand-500/50 hover:scale-[1.02] hover:brightness-110
      active:scale-[0.98]
    `,
    secondary: `
      glass-light text-slate-200 px-5 py-2.5
      hover:bg-white/10 hover:scale-[1.02]
      active:scale-[0.98]
    `,
    ghost: `
      text-slate-400 hover:text-white px-4 py-2
      hover:bg-white/5 rounded-lg
    `,
    danger: `
      bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5
      hover:bg-red-500/20 hover:scale-[1.02]
      active:scale-[0.98]
    `,
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
