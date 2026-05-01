import React from "react";

export const Subheading: React.FC<React.ComponentPropsWithoutRef<"h3">> = ({
  className = "",
  ...props
}) => {
  return (
    <h3
      data-slot="subheading"
      className={`text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 ${className}`}
      {...props}
    />
  );
};
