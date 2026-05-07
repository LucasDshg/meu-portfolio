import React from 'react';

interface IAvatarProps extends React.ComponentPropsWithoutRef<'span'> {
  src?: string | null;
  initials?: string;
  alt?: string;
  size?: string;
  className?: string;
}

export const Avatar: React.FC<IAvatarProps> = ({
  src,
  initials,
  alt = '',
  size = 'size-16',
  className = '',
  ...props
}) => {
  return (
    <span
      data-slot="avatar"
      className={`relative inline-flex shrink-0 self-start items-center justify-center aspect-square overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 shadow-md ring-1 ring-zinc-900/5 ${size} ${className}`}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-contain" />
      ) : (
        <span className="flex items-center justify-center text-zinc-500 font-medium">
          {initials}
        </span>
      )}
    </span>
  );
};
