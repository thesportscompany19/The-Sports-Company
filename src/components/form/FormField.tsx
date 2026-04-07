"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-[#0B1C2D]">
        {label}
        {required && <span className="text-[#C62828] ml-0.5">*</span>}
      </Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="h-12 border border-gray-300 rounded-lg bg-white focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:border-[#C62828] px-3"
      />
    </div>
  );
}
