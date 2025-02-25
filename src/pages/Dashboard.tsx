
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Send,
  FileBarChart,
  User,
} from "lucide-react";
import { SidebarLogo } from "@/components/dashboard/SidebarLogo";
import { FirstLevelMenu } from "@/components/dashboard/FirstLevelMenu";
import { TopBar } from "@/components/dashboard/TopBar";
import { SecondLevelMenu } from "@/components/dashboard/SecondLevelMenu";
import { MainContent } from "@/components/dashboard/MainContent";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("home"); // Changed default to "home"
  const [isSecondLevelMenuCollapsed, setIsSecondLevelMenuCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeSecondLevel, setActiveSecondLevel] = useState<string>("");

  const firstLevelMenuItems = [
    { id: "home", icon: LayoutDashboard, label: "Home" },
    { id: "sccm", icon: Package, label: "SCCM" },
    { id: "intune", icon: Send, label: "Intune" },
    { id: "reports", icon: FileBarChart, label: "Reports" },
    { id: "user", icon: User, label: "User" },
  ];

  const secondLevelMenuItems = {
    home: [],
    sccm: ["Updates Catalog", "Application Catalog", "Published Task", "Connection"],
    intune: ["Updates Catalog", "Application Catalog", "Published Task", "Connection"],
    reports: ["Usage Reports", "Deployment Status", "Audit Logs"],
    user: ["Profile", "Settings", "Logout"],
  };

  const currentSecondLevelItems = secondLevelMenuItems[activeMenu as keyof typeof secondLevelMenuItems] || [];
  const activeMenuLabel = firstLevelMenuItems.find(item => item.id === activeMenu)?.label || "";

  const handleSecondLevelSelect = (item: string) => {
    setActiveSecondLevel(item);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-16 bg-[#353640] text-white flex flex-col shadow-[4px_0px_8px_0px_rgba(0,0,0,0.15)]">
        <SidebarLogo />
        <FirstLevelMenu 
          items={firstLevelMenuItems}
          activeMenu={activeMenu}
          onMenuSelect={setActiveMenu}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <TopBar 
          isDarkTheme={isDarkTheme}
          onThemeToggle={() => setIsDarkTheme(!isDarkTheme)}
        />

        <div className="flex flex-1">
          {currentSecondLevelItems.length > 0 && (
            <SecondLevelMenu
              items={currentSecondLevelItems}
              title={activeMenuLabel}
              isCollapsed={isSecondLevelMenuCollapsed}
              onCollapse={setIsSecondLevelMenuCollapsed}
              activeItem={activeSecondLevel}
              onItemSelect={handleSecondLevelSelect}
            />
          )}
          <MainContent 
            isDarkTheme={isDarkTheme} 
            activeMenu={activeMenu}
            activeSecondLevel={activeSecondLevel}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
