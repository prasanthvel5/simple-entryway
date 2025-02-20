
import { cn } from "@/lib/utils";

interface MainContentProps {
  isDarkTheme: boolean;
}

export const MainContent = ({ isDarkTheme }: MainContentProps) => {
  return (
    <main className={cn(
      "flex-1 p-6 transition-colors",
      isDarkTheme ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
    )}>
      <h2 className="text-xl font-semibold mb-6">
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
    </main>
  );
};
