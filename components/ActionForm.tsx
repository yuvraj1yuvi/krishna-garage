"use client";
import toast from "react-hot-toast";
import { useRef } from "react";

interface ActionFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  action: (formData: FormData) => Promise<any>;
  successMessage: string;
}

export function ActionForm({ action, successMessage, children, className, ...props }: ActionFormProps) {
  const ref = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      await action(formData);
      toast.success(successMessage);
      ref.current?.reset();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <form ref={ref} action={handleSubmit} className={className} {...props}>
      {children}
    </form>
  );
}
