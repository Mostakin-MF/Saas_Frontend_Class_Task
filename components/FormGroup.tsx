import { ReactNode } from "react";

interface FormGroupProps {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}

export function FormGroup({ label, required = false, error, children }: FormGroupProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
