import React from "react";

export const Text: React.FC<React.ComponentPropsWithoutRef<"p">> = ({
  className = "",
  ...props
}) => {
  return (
    <p
      data-slot="text"
      className={`text-base text-zinc-600 dark:text-zinc-400 leading-7 ${className}`}
      {...props}
    />
  );
};
