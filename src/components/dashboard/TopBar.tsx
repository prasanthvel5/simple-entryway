
import { Bell, User, Sun, Moon } from "lucide-react";

interface TopBarProps {
  isDarkTheme: boolean;
  onThemeToggle: () => void;
}

export const TopBar = ({ isDarkTheme, onThemeToggle }: TopBarProps) => {
  return (
    <header className="h-12 bg-[#353640] text-white flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">
        Patch Tune
      </h1>
      <div className="flex items-center gap-4">
        <button className="hover:bg-gray-700/50 p-1.5 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="hover:bg-gray-700/50 p-1.5 rounded-lg transition-colors">
          <User className="w-5 h-5" />
        </button>
        <button 
          onClick={onThemeToggle}
          className="hover:bg-gray-700/50 p-1.5 rounded-lg transition-colors"
        >
          {isDarkTheme ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};
