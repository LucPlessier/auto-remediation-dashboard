import * as React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const getVariantClasses = (variant: BadgeProps['variant'] = 'default') => {
  switch (variant) {
    case 'secondary':
      return 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200/80'
    case 'destructive':
      return 'border-transparent bg-red-100 text-red-900 shadow hover:bg-red-100/80'
    case 'outline':
      return 'text-gray-900 border-gray-200'
    default:
      return 'border-transparent bg-blue-100 text-blue-900 shadow hover:bg-blue-100/80'
  }
}

export function Badge({ 
  className = '', 
  variant = 'default', 
  ...props 
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2'
  const variantClasses = getVariantClasses(variant)
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`

  return (
    <div className={combinedClasses} {...props} />
  )
}
