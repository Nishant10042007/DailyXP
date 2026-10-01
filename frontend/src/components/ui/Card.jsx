import React from 'react';

export const Card = ({ children, className = '', glowing = false, ...props }) => (
  <div
    className={`glass rounded-2xl p-6 ${glowing ? 'glow-purple-sm' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, className = '' }) => (
  <div className={`mb-5 ${className}`}>
    <h3 className="text-lg font-semibold text-slate-100 tracking-tight">{title}</h3>
    {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
  </div>
);
