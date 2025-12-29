import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'code' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const styles = {
    default: "bg-zinc-800 text-zinc-300 border border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    error: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    code: "bg-zinc-950 text-zinc-400 font-mono border border-zinc-800",
    outline: "border border-zinc-700 text-zinc-400 bg-transparent"
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};