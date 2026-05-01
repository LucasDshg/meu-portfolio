import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold transition-colors cursor-pointer";

  const variants = {
    primary:
      "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 active:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700",
    secondary:
      "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
    outline:
      "ring-1 ring-zinc-900/10 text-zinc-900 hover:ring-teal-500 hover:text-teal-600 dark:ring-white/10 dark:text-zinc-400 dark:hover:ring-teal-400 dark:hover:text-teal-400",
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
