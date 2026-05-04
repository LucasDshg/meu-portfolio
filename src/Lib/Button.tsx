import React from 'react';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<IButtonProps> = ({
  href,
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold transition-colors cursor-pointer';

  const variants = {
    secondary:
      'bg-zinc-500 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700',
    primary:
      'bg-teal-100 text-teal-700 hover:bg-teal-200 active:bg-teal-200 dark:bg-teal-400/10 dark:text-teal-300 dark:hover:bg-teal-400/20',
    outline:
      'ring-1 ring-zinc-900/20 text-zinc-500 hover:ring-teal-500 hover:text-teal-600 dark:ring-white/10 dark:text-zinc-400 dark:hover:ring-teal-400 dark:hover:text-teal-400',
    ghost:
      'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        {...(props as {
          download: boolean | string;
          target: string;
          rel: string;
        })}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
