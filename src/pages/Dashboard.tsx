
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
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
import PublishedTask from "./PublishedTask";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("home");
  const [isSecondLevelMenuCollapsed, setIsSecondLevelMenuCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [activeSecondLevel, setActiveSecondLevel] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  // Set active menu based on URL path
  useEffect(() => {
    if (location.pathname.includes('publish-task-wizard')) {
      setActiveMenu("intune");
      setActiveSecondLevel("Published Task");
    }
  }, [location.pathname]);

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
    
    // When "Published Task" is selected from Intune menu, navigate to the published task view
    if (activeMenu === "intune" && item === "Published Task") {
      navigate('/dashboard');
    }
  };

  const shouldShowPublishedTask = activeMenu === "intune" && activeSecondLevel === "Published Task" && !location.pathname.includes('publish-task-wizard');

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
          
          {shouldShowPublishedTask ? (
            <PublishedTask isDarkTheme={isDarkTheme} />
          ) : location.pathname.includes('publish-task-wizard') ? (
            <Outlet context={{ isDarkTheme, activeMenu, activeSecondLevel }} />
          ) : (
            <MainContent 
              isDarkTheme={isDarkTheme} 
              activeMenu={activeMenu}
              activeSecondLevel={activeSecondLevel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

