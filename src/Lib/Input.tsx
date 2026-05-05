import React, { useState } from 'react';

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<IInputProps> = ({
  label,
  className = '',
  id,
  ...props
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        onBlur={() => setIsTouched(true)}
        className={`w-full rounded-xl border bg-white px-4 py-2 text-zinc-900 shadow-sm transition-all focus:outline-none focus:ring-4 dark:bg-zinc-800 dark:text-zinc-100 
          ${isTouched ? 'invalid:border-red-500 invalid:ring-red-500/10 border-zinc-200 dark:border-zinc-700' : 'border-zinc-200 dark:border-zinc-700'}
          focus:border-teal-500 focus:ring-teal-500/10 dark:focus:border-teal-400
          read-only:bg-zinc-50 dark:read-only:bg-zinc-900/50 read-only:cursor-not-allowed read-only:focus:ring-0 read-only:border-zinc-200 dark:read-only:border-zinc-700
          ${className}`}
        {...props}
      />
    </div>
  );
};
