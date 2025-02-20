
import { useState } from "react";
import {
  LayoutDashboard,
  Shield,
  Package,
  Send,
  FileBarChart,
  Cloud,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSecondLevelMenuCollapsed, setIsSecondLevelMenuCollapsed] = useState(false);

  const firstLevelMenuItems = [
    { id: "home", icon: LayoutDashboard, label: "Home" },
    { id: "sccm", icon: Package, label: "SCCM" },
    { id: "intune", icon: Send, label: "Intune" },
    { id: "reports", icon: FileBarChart, label: "Reports" },
    { id: "user", icon: User, label: "User" },
  ];

  const secondLevelMenuItems = {
    home: [],
    sccm: ["Updates Catalog", "Application Catalog", "Published Task","Connection"],
    intune: ["Updates Catalog", "Application Catalog", "Published Task","Connection"],
    reports: ["Usage Reports", "Deployment Status", "Audit Logs"],
    user: ["Profile", "Settings", "Logout"],
  };

  const currentSecondLevelItems = secondLevelMenuItems[activeMenu as keyof typeof secondLevelMenuItems] || [];
  const showSecondLevelMenu = currentSecondLevelItems.length > 0 && !isSecondLevelMenuCollapsed;

  return (
    <div className="min-h-screen flex">
      {/* First Level Menu with Header */}
      <div className="w-16 bg-[#353640] text-white flex flex-col shadow-[4px_0px_8px_0px_rgba(0,0,0,0.15)]">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>
        <nav className="flex-1 pt-4">
          {firstLevelMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
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
      </div>

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-12 bg-[#353640] text-white flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">
            Patch Tune
          </h1>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-gray-700" />
            <button className="w-8 h-8 rounded-full bg-gray-700" />
          </div>
        </header>

        <div className="flex flex-1">
          {/* Second Level Menu */}
          {currentSecondLevelItems.length > 0 && (
            <div className={cn(
              "bg-[#202131] text-white transition-all duration-300 flex",
              showSecondLevelMenu ? "w-40" : "w-6"
            )}>
              {showSecondLevelMenu ? (
                <>
                  <div className="flex-1">
                    <div className="p-4 border-b border-gray-700">
                      <h2 className="text-sm font-semibold">
                        {firstLevelMenuItems.find((item) => item.id === activeMenu)?.label}
                      </h2>
                    </div>
                    <nav className="pt-2">
                      {currentSecondLevelItems.map((item) => (
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
                    onClick={() => setIsSecondLevelMenuCollapsed(true)}
                    className="px-1 py-2 hover:bg-gray-700/50 self-start mt-4"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsSecondLevelMenuCollapsed(false)}
                  className="w-6 hover:bg-gray-700/50 flex items-center justify-center"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 bg-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Getting start by configuring Intune Settings
            </h2>
            <div className="flex gap-6">
              <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                <button className="bg-gray-200 rounded-md px-6 py-3">
                  Sign in with Microsoft to Grant API Permissions
                </button>
                <div className="mt-4">
                  <a href="#" className="text-blue-600 hover:underline">
                    List of required permissions
                  </a>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                <div className="space-y-4">
                  <p className="text-center text-sm text-gray-600">
                    Connect with Intune using API keys.
                    <br />
                    Follow the steps to generate keys
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Application ID
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Directory ID
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Client Secret
                      </label>
                      <input
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <button className="w-full bg-gray-200 rounded-md px-6 py-2">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
