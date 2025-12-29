import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = "primary", 
  disabled = false, 
  icon: Icon, 
  className = "",
  ...props
}) => {
  const baseStyle = "flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 focus:ring-zinc-300";
  
  const variants = {
    // White background, dark text for primary (Standard Dark Mode Primary)
    primary: "bg-zinc-50 text-zinc-900 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.1)]",
    // Dark background, light border for secondary
    secondary: "bg-zinc-900 border border-zinc-800 text-zinc-100 hover:bg-zinc-800 focus:ring-zinc-800 disabled:opacity-50",
    // Ghost
    ghost: "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50",
    // Danger
    danger: "bg-red-900/50 border border-red-900 text-red-200 hover:bg-red-900/70"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} className="mr-2" />}
      {children}
    </button>
  );
};