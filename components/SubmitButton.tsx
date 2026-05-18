"use client";
import { useFormStatus } from "react-dom";
import React from "react";

export function SubmitButton({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <button 
      {...props} 
      type="submit" 
      disabled={pending || props.disabled}
      className={`${className} relative transition-all disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      <span className={pending ? "opacity-0" : "opacity-100"}>{children}</span>
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}
