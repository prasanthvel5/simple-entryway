
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import chromeLogo from './resources/2chrome.png';

interface MainContentProps {
  isDarkTheme: boolean;
  activeMenu: string;
  activeSecondLevel: string;
}

export const MainContent = ({ isDarkTheme, activeMenu, activeSecondLevel }: MainContentProps) => {
  if (activeMenu === "intune" && activeSecondLevel === "Updates Catalog") {
    return (
      <main className={cn(
        "flex-1 p-6 transition-colors rounded-tl-2xl relative",
        isDarkTheme ? "bg-gray-900 text-white" : "bg-[#353640] text-white"
      )}>
        <div className={cn(
          "absolute inset-0 rounded-tl-2xl",
          isDarkTheme ? "bg-gray-900" : "bg-gray-100"
        )} />
        <div className="relative z-10">
          <div className="space-y-6">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
              Create Publish Task
            </button>
            
            <div className="grid grid-cols-4 gap-4">
              <div className={cn(
                "bg-white/5 backdrop-blur-sm rounded-lg p-3",
                isDarkTheme ? "border border-white/10" : "border border-gray-200"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/20 p-1 rounded">
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1 h-1 bg-blue-400 rounded-sm"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-sm"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-sm"></div>
                        <div className="w-1 h-1 bg-blue-400 rounded-sm"></div>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-blue-400">1050</span>
                  </div>
                  <p className="text-xs text-gray-400">Total Applications</p>
                </div>
              </div>
              <div className={cn(
                "bg-white/5 backdrop-blur-sm rounded-lg p-3",
                isDarkTheme ? "border border-white/10" : "border border-gray-200"
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-blue-600">75</span>
                  <p className="text-xs text-gray-400">Installed</p>
                </div>
              </div>
              <div className={cn(
                "bg-white/5 backdrop-blur-sm rounded-lg p-3",
                isDarkTheme ? "border border-white/10" : "border border-gray-200"
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-green-500">24</span>
                  <p className="text-xs text-gray-400">Update Published</p>
                </div>
              </div>
              <div className={cn(
                "bg-white/5 backdrop-blur-sm rounded-lg p-3",
                isDarkTheme ? "border border-white/10" : "border border-gray-200"
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold text-orange-500">51</span>
                  <p className="text-xs text-gray-400">Installed but not published</p>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "mt-6 rounded-lg shadow overflow-hidden",
            isDarkTheme ? "bg-gray-800" : "bg-white"
          )}>
            <div className="overflow-x-auto">
              <div className="overflow-y-auto max-h-[600px]">
                <table className="w-full">
                  <thead className={cn(
                    "sticky top-0 z-10",
                    isDarkTheme ? "bg-gray-700" : "bg-gray-100"
                  )}>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left whitespace-nowrap">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium resize-x overflow-hidden",
                        isDarkTheme ? "text-gray-200" : "text-gray-600"
                      )}>Application Name</th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium resize-x overflow-hidden",
                        isDarkTheme ? "text-gray-200" : "text-gray-600"
                      )}>Vendor</th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium resize-x overflow-hidden",
                        isDarkTheme ? "text-gray-200" : "text-gray-600"
                      )}>Latest Version</th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium resize-x overflow-hidden",
                        isDarkTheme ? "text-gray-200" : "text-gray-600"
                      )}>Release date</th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium",
                        isDarkTheme ? "text-gray-200" : "text-gray-600"
                      )}>Category</th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium",
                        isDarkTheme ? "text-gray-200" : "text-gray-600"
                      )}>Inventory Status</th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium",
                        isDarkTheme ? "text-gray-200" : "text-gray-600"
                      )}>Publish Status</th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium",
                        isDarkTheme ? "text-gray-200" : "text-gray-600"
                      )}>Publish Task</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkTheme ? "text-gray-300" : "text-gray-800"}>
                    {[...Array(11)].map((_, index) => (
                      <tr key={index} className={cn(
                        "border-b",
                        isDarkTheme ? "border-gray-700" : "border-gray-200"
                      )}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={index === 0} className="rounded" />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img src="{chromeLogo}" alt="" className="w-6 h-6" />
                            Google Chrome
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">Google</td>
                        <td className="px-4 py-3 whitespace-nowrap">102.25.{index + 1}</td>
                        <td className="px-4 py-3 whitespace-nowrap">Apr {index + 1}, 2024</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            Browser
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">Installed</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-green-600 flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Updates Published
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <a href="#" className="text-blue-500 hover:underline">Task {index + 1}</a>
                            <a href="#" className="text-blue-500 hover:underline">Chrome publish</a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={cn(
              "px-4 py-3 border-t flex items-center justify-between text-sm",
              isDarkTheme ? "border-gray-700 text-gray-300" : "text-gray-600"
            )}>
              <div>1-20 of 85 items</div>
              <div className="flex items-center gap-2">
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : ""
                )} disabled>&lt;</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "bg-blue-900" : "bg-blue-50"
                )}>1</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : ""
                )}>2</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : ""
                )}>3</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : ""
                )}>4</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : ""
                )}>5</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : ""
                )}>&gt;</button>
                <select className={cn(
                  "border rounded px-2 py-1",
                  isDarkTheme ? "bg-gray-800 border-gray-600" : ""
                )}>
                  <option>20 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={cn(
      "flex-1 p-6 transition-colors rounded-tl-2xl relative",
      isDarkTheme ? "bg-gray-900 text-white" : "bg-[#353640] text-white"
    )}>
      <div className={cn(
        "absolute inset-0 rounded-tl-2xl",
        isDarkTheme ? "bg-gray-900" : "bg-gray-100"
      )} />
      <div className="relative z-10">
        <h2 className={cn(
          "text-xl font-semibold mb-6",
          isDarkTheme ? "text-white" : "text-gray-800"
        )}>
          Getting start by configuring Intune Settings
        </h2>
        <div className="flex gap-6">
          <div className={cn(
            "flex-1 rounded-lg p-6 shadow-sm",
            isDarkTheme ? "bg-gray-800" : "bg-white"
          )}>
            <button className={cn(
              "rounded-md px-6 py-3",
              isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
            )}>
              Sign in with Microsoft to Grant API Permissions
            </button>
            <div className="mt-4">
              <a href="#" className="text-blue-600 hover:underline">
                List of required permissions
              </a>
            </div>
          </div>

          <div className={cn(
            "flex-1 rounded-lg p-6 shadow-sm",
            isDarkTheme ? "bg-gray-800" : "bg-white"
          )}>
            <div className="space-y-4">
              <p className={cn(
                "text-center text-sm",
                isDarkTheme ? "text-gray-300" : "text-gray-600"
              )}>
                Connect with Intune using API keys.
                <br />
                Follow the steps to generate keys
              </p>
              <div className="space-y-4">
                <div>
                  <label className={cn(
                    "block text-sm font-medium",
                    isDarkTheme ? "text-gray-200" : "text-gray-700"
                  )}>
                    Application ID
                  </label>
                  <input
                    type="text"
                    className={cn(
                      "mt-1 block w-full rounded-md border shadow-sm",
                      isDarkTheme 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500" 
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    )}
                  />
                </div>
                <div>
                  <label className={cn(
                    "block text-sm font-medium",
                    isDarkTheme ? "text-gray-200" : "text-gray-700"
                  )}>
                    Directory ID
                  </label>
                  <input
                    type="text"
                    className={cn(
                      "mt-1 block w-full rounded-md border shadow-sm",
                      isDarkTheme 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500" 
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    )}
                  />
                </div>
                <div>
                  <label className={cn(
                    "block text-sm font-medium",
                    isDarkTheme ? "text-gray-200" : "text-gray-700"
                  )}>
                    Client Secret
                  </label>
                  <input
                    type="password"
                    className={cn(
                      "mt-1 block w-full rounded-md border shadow-sm",
                      isDarkTheme 
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500" 
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    )}
                  />
                </div>
                <button className={cn(
                  "w-full rounded-md px-6 py-2",
                  isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
                )}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
