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
  accent?: "red" | "blue" | "green";
}

interface CustomTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  /** Render each tab's content: receives the active tab value */
  children: (value: string) => React.ReactNode;
  /** Allow the tab list to scroll horizontally */
  scrollable?: boolean;
  /** Stretch every tab equally to fill the available width */
  fullWidth?: boolean;
  /** Center the tab list horizontally */
  centered?: boolean;
  className?: string;
}

export function CustomTabs({
  tabs,
  defaultValue,
  children,
  scrollable = false,
  fullWidth = false,
  centered = false,
  className,
}: CustomTabsProps) {
  const first = defaultValue ?? tabs[0]?.value;

  return (
    <Tabs defaultValue={first} className={cn("w-full", className)}>
      {/* Tab list */}
      <div
        className={cn(
          scrollable && "max-w-full overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide",
          fullWidth && "w-full",
          centered && "flex justify-center"
        )}
      >
        <TabsList
          className={cn(
            "h-auto gap-2 rounded-2xl border border-slate-200 bg-slate-100/90 p-1.5 shadow-sm",
            fullWidth
              ? "flex w-full"
              : scrollable
                ? "flex w-max min-w-full sm:min-w-0"
                : "inline-flex max-w-full flex-wrap"
          )}
        >
          {tabs.map((tab, index) => {
            const accent = tab.accent ?? (["red", "blue", "green"] as const)[index % 3];
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "min-h-11 cursor-pointer rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C62828] focus-visible:ring-offset-2 active:translate-y-0 data-[state=active]:border-[#0B1C2D] data-[state=active]:bg-[#0B1C2D] data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-[#0B1C2D]/20",
                  fullWidth && "min-w-0 flex-1 whitespace-normal",
                  !fullWidth && "shrink-0 whitespace-nowrap",
                  accent === "red" && "bg-rose-50 hover:border-rose-200 hover:bg-rose-100",
                  accent === "blue" && "bg-sky-50 hover:border-sky-200 hover:bg-sky-100",
                  accent === "green" && "bg-emerald-50 hover:border-emerald-200 hover:bg-emerald-100"
                )}
              >
                <span className={cn("flex items-center justify-center gap-2", fullWidth && "flex-wrap text-center text-xs sm:text-sm")}>
                  {tab.icon && <span className="shrink-0 flex items-center">{tab.icon}</span>}
                  {tab.label}
                </span>
              </TabsTrigger>
            );
          })}
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
