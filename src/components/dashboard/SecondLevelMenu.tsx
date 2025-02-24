
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecondLevelMenuProps {
  items: string[];
  title: string;
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const SecondLevelMenu = ({ items, title, isCollapsed, onCollapse }: SecondLevelMenuProps) => {
  const showContent = !isCollapsed;

  return (
    <div className={cn(
      "bg-[#202131] text-white transition-all duration-300 flex rounded-tl-2xl",
      showContent ? "w-40" : "w-6"
    )}>
      {showContent ? (
        <>
          <div className="flex-1">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-sm font-semibold">{title}</h2>
            </div>
            <nav className="pt-2">
              {items.map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700/50 transition-colors text-xs"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <button 
            onClick={() => onCollapse(true)}
            className="px-1 py-2 hover:bg-gray-700/50 self-start mt-4"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </>
      ) : (
        <button 
          onClick={() => onCollapse(false)}
          className="w-6 hover:bg-gray-700/50 flex items-center justify-center rounded-tl-2xl"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
