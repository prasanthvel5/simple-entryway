
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
          <div className="flex gap-4 mb-6">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Create Publish Task
            </button>
            <div className="flex items-center gap-8 bg-blue-100/10 px-6 py-2 rounded-md flex-1">
              <div>
                <span className="text-4xl text-blue-400">1050</span>
                <p className="text-sm text-gray-500">Total Applications</p>
              </div>
              <div>
                <span className="text-4xl text-blue-600">75</span>
                <p className="text-sm text-gray-500">Installed</p>
              </div>
              <div>
                <span className="text-4xl text-green-500">24</span>
                <p className="text-sm text-gray-500">Update Published</p>
              </div>
              <div>
                <span className="text-4xl text-orange-500">51</span>
                <p className="text-sm text-gray-500">Installed but not published</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-4 py-3 text-left text-gray-600">Application Name</th>
                  <th className="px-4 py-3 text-left text-gray-600">Vendor</th>
                  <th className="px-4 py-3 text-left text-gray-600">Latest Version</th>
                  <th className="px-4 py-3 text-left text-gray-600">Release date</th>
                  <th className="px-4 py-3 text-left text-gray-600">Category</th>
                  <th className="px-4 py-3 text-left text-gray-600">Inventory Status</th>
                  <th className="px-4 py-3 text-left text-gray-600">Publish Status</th>
                  <th className="px-4 py-3 text-left text-gray-600">Publish Task</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <input type="checkbox" checked className="rounded" />
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    <div className="flex items-center gap-2">
                      <img src="/chrome-icon.png" alt="" className="w-6 h-6" />
                      Google Chrome
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800">Google</td>
                  <td className="px-4 py-3 text-gray-800">102.25.3</td>
                  <td className="px-4 py-3 text-gray-800">Apr 30, 2024</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Browser
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-800">Installed</td>
                  <td className="px-4 py-3">
                    <span className="text-green-600 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Updates Published
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <a href="#" className="text-blue-500 hover:underline">Task 2</a>
                      <a href="#" className="text-blue-500 hover:underline">Chrome publish</a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="px-4 py-3 border-t flex items-center justify-between text-sm text-gray-600">
              <div>1-20 of 85 items</div>
              <div className="flex items-center gap-2">
                <button className="px-2 py-1 border rounded" disabled>&lt;</button>
                <button className="px-2 py-1 border rounded bg-blue-50">1</button>
                <button className="px-2 py-1 border rounded">2</button>
                <button className="px-2 py-1 border rounded">3</button>
                <button className="px-2 py-1 border rounded">4</button>
                <button className="px-2 py-1 border rounded">5</button>
                <button className="px-2 py-1 border rounded">&gt;</button>
                <select className="border rounded px-2 py-1">
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
