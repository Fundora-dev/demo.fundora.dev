import React, { ReactNode } from 'react';
import { usePointerParallax } from '../hooks/usePointerParallax';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  pill?: boolean; // For pill shape
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  pill = false,
  style, // Allow passing style for parallax
  ...props
}) => {
  const { parallaxStyle, onPointerMove, onPointerEnter, onPointerLeave } = usePointerParallax();

  const baseStyle = "inline-flex items-center justify-center font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4FAFF] transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed";
  
  const lightGlassInteractiveBase = "backdrop-blur-lg backdrop-saturate-150 border text-slate-800 shadow-lg shadow-slate-900/10 hover:scale-[0.97]";

  const variantStyles = {
    primary: `${lightGlassInteractiveBase} bg-slate-50/70 hover:bg-slate-50/80 border-slate-900/15 focus-visible:ring-[#0A6CFF]`,
    secondary: `${lightGlassInteractiveBase} bg-slate-50/70 hover:bg-slate-50/80 border-slate-900/15 focus-visible:ring-[#8B5CF6]`,
    outline: 'bg-slate-50/50 hover:bg-slate-50/70 backdrop-blur-md backdrop-saturate-150 text-[#0A6CFF] border border-slate-900/15 hover:border-slate-900/20 shadow-md shadow-slate-900/5 focus-visible:ring-[#0A6CFF]',
    danger: 'bg-red-500/80 backdrop-blur-md border border-red-500/50 hover:bg-red-600/90 text-white focus-visible:ring-red-500 shadow-md hover:shadow-lg',
    ghost: 'text-[#0A6CFF] hover:bg-slate-900/5 focus-visible:ring-[#0A6CFF] shadow-none bg-transparent backdrop-blur-sm'
  };

  const sizeStyles = {
    sm: `px-3.5 py-2 text-xs ${pill ? 'rounded-full' : 'rounded-lg'}`,
    md: `px-5 py-2.5 text-sm ${pill ? 'rounded-full' : 'rounded-xl'}`,
    lg: `px-7 py-3.5 text-base ${pill ? 'rounded-full' : 'rounded-[24px]'}`,
  };
  
  const isGlassVariant = variant === 'primary' || variant === 'secondary' || variant === 'outline';

  const combinedClassName = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button 
      className={combinedClassName} 
      disabled={isLoading || props.disabled} 
      style={isGlassVariant ? { ...parallaxStyle, ...style } : style}
      onPointerMove={isGlassVariant ? onPointerMove : undefined}
      onPointerEnter={isGlassVariant ? onPointerEnter : undefined}
      onPointerLeave={isGlassVariant ? onPointerLeave : undefined}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};