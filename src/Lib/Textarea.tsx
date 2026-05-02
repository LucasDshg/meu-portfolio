import React, { useState } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  className = "",
  rows = 4,
  ...props
}) => {
  const [isTouched, setIsTouched] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        onBlur={() => setIsTouched(true)}
        className={`w-full rounded-xl border bg-white px-4 py-2 text-zinc-900 shadow-sm transition-all focus:outline-none focus:ring-4 dark:bg-zinc-800 dark:text-zinc-100 
          ${isTouched ? "invalid:border-red-500 invalid:ring-red-500/10 border-zinc-200 dark:border-zinc-700" : "border-zinc-200 dark:border-zinc-700"}
          focus:border-teal-500 focus:ring-teal-500/10 dark:focus:border-teal-400 ${className}`}
        {...props}
      />
    </div>
  );
};
