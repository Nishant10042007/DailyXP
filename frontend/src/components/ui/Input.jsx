import React from 'react';

export const Input = ({ label, id, error, ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-slate-400 tracking-wide">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`
        w-full rounded-xl px-4 py-3 text-slate-100
        bg-white/5 border transition-all duration-200
        placeholder:text-slate-600
        focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/60
        ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/8 hover:border-white/15'}
      `}
      {...props}
    />
    {error && <span className="text-xs text-red-400 mt-0.5">{error}</span>}
  </div>
);
