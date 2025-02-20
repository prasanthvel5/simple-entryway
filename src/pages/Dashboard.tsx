
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const firstLevelMenuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "products", icon: Shield, label: "Products Catalog" },
    { id: "publish", icon: Send, label: "Publish Tasks" },
    { id: "reports", icon: FileBarChart, label: "Reports" },
    { id: "intune", icon: Cloud, label: "Intune Connection" },
    { id: "users", icon: Users, label: "Users" },
    { id: "user", icon: User, label: "User" },
  ];

  const secondLevelMenuItems = {
    dashboard: [],
    products: ["All Products", "Categories", "Publishers"],
    publish: ["Pending Tasks", "Completed Tasks", "Failed Tasks"],
    reports: ["Usage Reports", "Deployment Status", "Audit Logs"],
    intune: ["Connection Settings", "API Configuration", "Sync Status"],
    users: ["All Users", "Roles", "Permissions"],
    user: ["Profile", "Settings", "Logout"],
  };

  return (
    <div className="min-h-screen flex">
      {/* First Level Menu with Header */}
      <div className="w-16 bg-[#222222] text-white flex flex-col rounded-tr-lg rounded-br-lg">
        <div className="p-4 border-b border-gray-700">
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/374ee1d3-82a0-4ffc-aac8-fadb978b14bd.png"
              alt="Logo"
              className="w-10 h-10"
            />
          </div>
        </div>
        <nav className="flex-1 pt-4">
          {firstLevelMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={cn(
                "w-full flex flex-col items-center gap-1 px-2 py-3 hover:bg-gray-700/50 transition-colors",
                activeMenu === item.id && "bg-gray-700/50"
              )}
            >
              <item.icon 
                className={cn(
                  "w-6 h-6 transition-colors",
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
        <header className="h-12 bg-[#222222] text-white flex items-center justify-between px-6 rounded-tl-lg rounded-tr-lg">
          <h1 className="text-xl font-semibold">
            Getting start by configuring Intune Settings
          </h1>
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full bg-gray-700" />
            <button className="w-8 h-8 rounded-full bg-gray-700" />
          </div>
        </header>

        <div className="flex flex-1">
          {/* Second Level Menu */}
          <div className="w-40 bg-[#333333] text-white">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-sm font-semibold">
                {firstLevelMenuItems.find((item) => item.id === activeMenu)?.label}
              </h2>
            </div>
            <nav className="pt-2">
              {secondLevelMenuItems[activeMenu as keyof typeof secondLevelMenuItems]?.map(
                (item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700/50 transition-colors"
                  >
                    {item}
                  </button>
                )
              )}
            </nav>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 bg-gray-100 p-6">
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
