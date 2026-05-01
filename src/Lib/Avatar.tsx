import React from "react";

interface AvatarProps extends React.ComponentPropsWithoutRef<"span"> {
  src?: string | null;
  initials?: string;
  alt?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials,
  alt = "",
  className,
  ...props
}) => {
  return (
    <span
      data-slot="avatar"
      className={`inline-grid align-middle rounded-full bg-zinc-100 object-cover dark:bg-zinc-800 shadow-md ring-1 ring-zinc-900/5 ${className}`}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="flex items-center justify-center text-zinc-500">
          {initials}
        </span>
      )}
    </span>
  );
};
