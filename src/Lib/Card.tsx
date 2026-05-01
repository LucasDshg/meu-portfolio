import React from "react";

interface CardProps {
  children: React.ReactNode;
  variant?: "outline" | "primary";
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "outline",
  className = "",
}) => {
  const variants = {
    outline:
      "border border-zinc-100 dark:border-zinc-700/40 shadow-sm shadow-zinc-800/5",
    primary:
      "bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100/50 dark:border-zinc-700/10 shadow-sm shadow-zinc-800/5",
  };

  return (
    <div className="group relative flex h-full">
      <div className="absolute -inset-y-1 -inset-x-1 z-0 bg-zinc-50 opacity-0 transition group-hover:opacity-100 dark:bg-zinc-800/50 sm:rounded-2xl" />

      <div
        className={`relative z-10 flex flex-col w-full rounded-2xl p-6 transition-all duration-300 group-hover:scale-[1.02] ${variants[variant]} ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
