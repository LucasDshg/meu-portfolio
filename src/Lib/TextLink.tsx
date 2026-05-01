import React from "react";
import { Link } from "react-router-dom";

interface TextLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  variant?: "primary" | "icon";
  color?: string;
}

export const TextLink: React.FC<TextLinkProps> = ({
  variant = "primary",
  color = "dark:text-white text-zinc-950 hover:text-teal-600",
  className = "",
  ...props
}) => {
  const variants = {
    primary:
      "decoration-zinc-950/20 hover:decoration-zinc-950/50 dark:decoration-white/20 dark:hover:decoration-white/50 font-medium transition-colors",
    icon: "group -m-1 p-1 text-zinc-500 transition hover:text-teal-500 dark:text-zinc-400 dark:hover:text-teal-400 flex items-center justify-center",
  };

  const isInternal =
    props.href && props.href.startsWith("/") && !props.href.startsWith("//");

  if (isInternal) {
    return (
      <Link
        to={props.href!}
        className={`${variants[variant]} ${className} ${color}`}
        {...(props as any)}
      />
    );
  }

  return (
    <a
      data-slot="text-link"
      className={`${variants[variant]} ${className} ${color}`}
      {...props}
    />
  );
};
