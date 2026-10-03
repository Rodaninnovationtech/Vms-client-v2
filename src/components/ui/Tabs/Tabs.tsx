import { useState } from "react";
import type { ReactNode } from "react";

export interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultKey?: string;
}

const Tabs = ({ tabs, defaultKey }: TabsProps) => {
  const [active, setActive] = useState(defaultKey || tabs[0]?.key);

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors
            ${
              active === tab.key
                ? "text-primary-700"
                : "text-slate-500 hover:text-primary-600"
            }`}
          >
            {tab.label}
            {active === tab.key && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary-700 rounded-full" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-4">{tabs.find((t) => t.key === active)?.content}</div>
    </div>
  );
};

export default Tabs;
