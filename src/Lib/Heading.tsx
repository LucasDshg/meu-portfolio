import React from 'react';

export const Heading: React.FC<React.ComponentPropsWithoutRef<'h2'>> = ({
  className = '',
  ...props
}) => {
  return (
    <h2
      data-slot="heading"
      className={`text-2xl font-bold leading-16 tracking-tight text-zinc-800 dark:text-zinc-100 ${className}`}
      {...props}
    />
  );
};
