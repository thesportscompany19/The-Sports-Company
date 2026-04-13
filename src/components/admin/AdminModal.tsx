"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg",
  lg: "sm:max-w-xl",
  xl: "sm:max-w-2xl",
} as const;

interface AdminModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle?: string;
  size?: keyof typeof SIZE_CLASSES;
  onSave: () => void;
  saveLabel?: string;
  children: React.ReactNode;
}

export function AdminModal({
  open,
  onOpenChange,
  title,
  subtitle,
  size = "lg",
  onSave,
  saveLabel = "Save",
  children,
}: AdminModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 gap-0 overflow-hidden",
          SIZE_CLASSES[size],
        )}
      >
        {/* Modal Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white gap-0.5 rounded-t-xl">
          <DialogTitle className="text-base font-semibold text-[#0B1C2D] pr-8 leading-tight">
            {title}
          </DialogTitle>
          {subtitle && (
            <DialogDescription className="text-xs text-gray-400 leading-snug">
              {subtitle}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[65vh] [scrollbar-width:thin]">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-xl">
          <Button
            variant="outline"
            size="sm"
            className="min-w-20"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <PrimaryButton
            size="sm"
            className="min-w-28"
            onClick={onSave}
          >
            {saveLabel}
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
