import React from 'react';

interface IHeadingProps extends React.ComponentPropsWithoutRef<'h2'> {
  color?: string;
}

export const Heading: React.FC<IHeadingProps> = ({
  className = '',
  color = 'text-zinc-800 dark:text-zinc-100',
  ...props
}) => {
  return (
    <h2
      data-slot="heading"
      className={`text-2xl font-bold leading-10 sm:leading-16 tracking-tight  ${className} ${color}`}
      {...props}
    />
  );
};
