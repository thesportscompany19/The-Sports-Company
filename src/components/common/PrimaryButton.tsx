import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";

type PrimaryButtonProps = ComponentPropsWithoutRef<typeof Button>;

/**
 * PrimaryButton — The Sports Company branded CTA button.
 * Background: #C62828 (brand red). Hover: #a82020 (darker red).
 * Pass extra `className` to override padding, sizing, width, etc.
 */
export function PrimaryButton({ className, children, ...props }: PrimaryButtonProps) {
  return (
    <Button
      className={cn("bg-[#F0E140] hover:bg-[#b9ad2b] text-black", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
