import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`bg-zinc-900/50 border border-zinc-800 rounded-xl shadow-none backdrop-blur-sm ${className}`}>
    {children}
  </div>
);