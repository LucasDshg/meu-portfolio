import React from 'react';

interface IBadgeProps {
  children: React.ReactNode;
  color?: 'zinc' | 'primary' | 'secondary';
  className?: string;
}

export const Badge: React.FC<IBadgeProps> = ({
  children,
  color = 'zinc',
  className = '',
}) => {
  const baseStyles =
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors';

  const colors = {
    zinc: 'bg-zinc-50 text-zinc-600 ring-zinc-500/10 dark:bg-zinc-700/30 dark:text-zinc-300 dark:ring-zinc-700',
    primary:
      'bg-teal-50 text-teal-700 ring-teal-600/10 dark:bg-teal-400/10 dark:text-teal-300 dark:ring-teal-400/20',
    secondary:
      'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-400/30',
  };

  return (
    <span
      className={`
        ${baseStyles} 
        ${colors[color]} 
        ${className}
      `}
    >
      {children}
    </span>
  );
};
