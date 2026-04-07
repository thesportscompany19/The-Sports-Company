"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  /** Render each tab's content: receives the active tab value */
  children: (value: string) => React.ReactNode;
  /** "default" = white active pill | "dark" = #0B1C2D active pill */
  variant?: "default" | "dark";
  /** Allow the tab list to scroll horizontally */
  scrollable?: boolean;
  /** Center the tab list horizontally */
  centered?: boolean;
  className?: string;
}

export function CustomTabs({
  tabs,
  defaultValue,
  children,
  variant = "default",
  scrollable = false,
  centered = false,
  className,
}: CustomTabsProps) {
  const first = defaultValue ?? tabs[0]?.value;

  return (
    <Tabs defaultValue={first} className={cn("w-full", className)}>
      {/* Tab list */}
      <div
        className={cn(
          scrollable && "overflow-x-auto pb-1 scrollbar-hide",
          centered && "flex justify-center"
        )}
      >
        <TabsList
          className={cn(
            "h-auto rounded-lg p-1  gap-3",
            scrollable ? "flex w-max min-w-full" : "inline-flex flex-wrap",
            variant === "dark" ? "bg-gray-100" : "bg-gray-100"
          )}
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "px-4 py-4 rounded-md text-sm font-medium whitespace-nowrap transition-all bg-white",
                variant === "dark"
                  ? [
                      "text-[#0B1C2D]",
                      "data-[state=active]:bg-[#0B1C2D]",
                      "data-[state=active]:text-white",
                      "data-[state=active]:shadow-none",
                    ]
                  : [
                      "text-gray-500",
                      "data-[state=active]:bg-white",
                      "data-[state=active]:text-[#0B1C2D]",
                      "data-[state=active]:shadow-sm",
                    ]
              )}
            >
              <span className="flex items-center gap-2">
                {tab.icon && <span className="shrink-0 flex items-center">{tab.icon}</span>}
                {tab.label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Tab panels */}
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {children(tab.value)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
