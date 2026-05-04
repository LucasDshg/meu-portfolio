import React from 'react';

export const Subheading: React.FC<React.ComponentPropsWithoutRef<'h3'>> = ({
  className = '',
  color = 'text-zinc-500 dark:text-zinc-400',
  ...props
}) => {
  return (
    <h3
      data-slot="subheading"
      className={`text-base font-semibold tracking-tight ${color} ${className}`}
      {...props}
    />
  );
};
