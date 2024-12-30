import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const getVariantClasses = (variant: ButtonProps['variant'] = 'default') => {
  switch (variant) {
    case 'destructive':
      return 'bg-red-500 text-white hover:bg-red-600'
    case 'outline':
      return 'border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900'
    case 'secondary':
      return 'bg-gray-100 text-gray-900 hover:bg-gray-200'
    case 'ghost':
      return 'hover:bg-gray-100 hover:text-gray-900'
    case 'link':
      return 'text-blue-600 underline-offset-4 hover:underline'
    default:
      return 'bg-blue-600 text-white hover:bg-blue-700'
  }
}

const getSizeClasses = (size: ButtonProps['size'] = 'default') => {
  switch (size) {
    case 'sm':
      return 'h-8 px-3 text-xs'
    case 'lg':
      return 'h-12 px-8 text-base'
    case 'icon':
      return 'h-9 w-9'
    default:
      return 'h-9 px-4 py-2 text-sm'
  }
}

export function Button({
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  const variantClasses = getVariantClasses(variant)
  const sizeClasses = getSizeClasses(size)
  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`

  return (
    <button className={combinedClasses} {...props} />
  )
}
