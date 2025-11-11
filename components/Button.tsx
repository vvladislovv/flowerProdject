'use client'

import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  fullWidth?: boolean
  color?: 'green' | 'purple'
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  color = 'green',
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-filter backdrop-blur-lg rounded-xl'
  
  const variantClasses = {
    primary: color === 'green' 
      ? 'bg-primary-green/90 text-white border border-primary-green/50 hover:bg-primary-green hover:shadow-lg active:scale-95'
      : 'bg-primary-purple/90 text-white border border-primary-purple/50 hover:bg-primary-purple hover:shadow-lg active:scale-95',
    secondary: 'glass-button text-gray-700 border border-white/30 hover:bg-white/70 active:scale-95',
    outline: color === 'green'
      ? 'glass-button border-2 border-primary-green/50 text-primary-green hover:bg-primary-green/20 hover:border-primary-green active:scale-95'
      : 'glass-button border-2 border-primary-purple/50 text-primary-purple hover:bg-primary-purple/20 hover:border-primary-purple active:scale-95',
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

