import React from 'react';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Responsive container with optimized padding and max-width for all screen sizes
 * Mobile: full width with padding
 * Tablet: optimized for medium screens
 * Desktop: centered with max-width
 */
export function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  return (
    <div className={`w-full px-4 sm:px-6 md:px-8 mx-auto max-w-7xl ${className}`}>
      {children}
    </div>
  );
}

/**
 * Responsive grid that adapts to screen size
 * Mobile: 1 column
 * Tablet: 2 columns
 * Desktop: 3-4 columns
 */
export function ResponsiveGrid({
  children,
  cols = 'md:grid-cols-2 lg:grid-cols-3',
  gap = 'gap-4',
  className = '',
}: {
  children: React.ReactNode;
  cols?: string;
  gap?: string;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 ${cols} ${gap} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Mobile-first responsive text that scales appropriately
 */
export function ResponsiveText({
  children,
  size = 'base',
  className = '',
}: {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  className?: string;
}) {
  const sizeClasses = {
    xs: 'text-xs sm:text-xs',
    sm: 'text-sm sm:text-sm md:text-base',
    base: 'text-base sm:text-base md:text-lg',
    lg: 'text-lg sm:text-xl md:text-2xl',
    xl: 'text-xl sm:text-2xl md:text-3xl',
    '2xl': 'text-2xl sm:text-3xl md:text-4xl',
  };

  return <span className={`${sizeClasses[size]} ${className}`}>{children}</span>;
}

/**
 * Responsive button group that stacks on mobile
 */
export function ResponsiveButtonGroup({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 ${className}`}>
      {children}
    </div>
  );
}
