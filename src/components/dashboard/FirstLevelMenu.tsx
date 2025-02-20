
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FirstLevelMenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface FirstLevelMenuProps {
  items: FirstLevelMenuItem[];
  activeMenu: string;
  onMenuSelect: (id: string) => void;
}

export const FirstLevelMenu = ({ items, activeMenu, onMenuSelect }: FirstLevelMenuProps) => {
  return (
    <nav className="flex-1 pt-4">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onMenuSelect(item.id)}
          className={cn(
            "w-full flex flex-col items-center gap-1 px-2 py-3 hover:bg-[#202131]/50 transition-colors relative",
            activeMenu === item.id && "bg-[#202131]"
          )}
        >
          {activeMenu === item.id && (
            <div className="absolute left-0 top-0 w-1 h-full bg-[#1EAEDB]" />
          )}
          <item.icon 
            className={cn(
              "w-5 h-5 transition-colors",
              activeMenu === item.id ? "text-[#1EAEDB]" : "text-white"
            )} 
          />
          <span 
            className={cn(
              "text-xs text-center leading-tight transition-colors",
              activeMenu === item.id ? "text-[#1EAEDB]" : "text-white"
            )}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};
