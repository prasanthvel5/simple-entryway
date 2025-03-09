
import { cn } from "@/lib/utils";
import { Check, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface MainContentProps {
  isDarkTheme: boolean;
  activeMenu: string;
  activeSecondLevel: string;
}

interface FilterCriteria {
  field: string;
  value: string;
}

export const MainContent = ({ isDarkTheme, activeMenu, activeSecondLevel }: MainContentProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const [filterInput, setFilterInput] = useState<FilterCriteria>({ field: "applicationName", value: "" });

  const addFilter = () => {
    if (filterInput.value.trim()) {
      setFilters([...filters, { ...filterInput }]);
      setFilterInput({ ...filterInput, value: "" });
    }
  };

  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const filterData = (data: any[]) => {
    if (filters.length === 0) return data;
    
    return data.filter(item => {
      return filters.every(filter => {
        const fieldValue = String(item[filter.field] || '').toLowerCase();
        return fieldValue.includes(filter.value.toLowerCase());
      });
    });
  };

  const tableData = [...Array(30)].map((_, index) => ({
    applicationName: `Google Chrome${index % 3 === 0 ? ' Enterprise' : index % 2 === 0 ? ' Dev' : ''}`,
    vendor: `Google${index % 5 === 0 ? ' Inc.' : ''}`,
    version: `102.25.${index + 1}`,
    releaseDate: `Apr ${(index % 30) + 1}, 2024`,
    category: index % 3 === 0 ? 'Browser' : index % 2 === 0 ? 'Development' : 'Productivity',
    inventoryStatus: index % 4 === 0 ? 'Not Installed' : 'Installed',
    publishStatus: index % 3 === 0 ? 'Updates Published' : index % 2 === 0 ? 'Pending' : 'Not Published',
    publishTask: `Task ${index + 1}`
  }));

  const filteredData = filterData(tableData);
  
  if (activeMenu === "intune" && activeSecondLevel === "Updates Catalog") {
    return (
      <main className={cn(
        "flex-1 p-6 transition-colors relative",
        isDarkTheme ? "bg-gray-900 text-white" : "bg-[#353640] text-white"
      )}>
        <div className={cn(
          "absolute inset-0",
          isDarkTheme ? "bg-gray-900" : "bg-gray-100"
        )} />
        <div className="relative z-10">
          <div className="space-y-6">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors">
              Create Publish Task
            </button>
            
            <div className="grid grid-cols-4 gap-4">
              <div className={cn(
                "bg-white/10 rounded-lg p-3 shadow-sm",
                isDarkTheme ? "border border-white/20" : "border border-gray-300 bg-white"
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
                    <div className="flex items-center">
                      <span className="text-xl font-semibold text-blue-400">1050</span>
                      <p className="ml-2 text-sm font-medium" style={{ color: isDarkTheme ? "#f3f4f6" : "#4a5568" }}>Total Applications</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={cn(
                "bg-white/10 rounded-lg p-3 shadow-sm",
                isDarkTheme ? "border border-white/20" : "border border-gray-300 bg-white"
              )}>
                <div className="flex items-center">
                  <span className="text-xl font-semibold text-blue-600">75</span>
                  <p className="ml-2 text-sm font-medium" style={{ color: isDarkTheme ? "#f3f4f6" : "#4a5568" }}>Installed</p>
                </div>
              </div>
              <div className={cn(
                "bg-white/10 rounded-lg p-3 shadow-sm",
                isDarkTheme ? "border border-white/20" : "border border-gray-300 bg-white"
              )}>
                <div className="flex items-center">
                  <span className="text-xl font-semibold text-green-500">24</span>
                  <p className="ml-2 text-sm font-medium" style={{ color: isDarkTheme ? "#f3f4f6" : "#4a5568" }}>Update Published</p>
                </div>
              </div>
              <div className={cn(
                "bg-white/10 rounded-lg p-3 shadow-sm",
                isDarkTheme ? "border border-white/20" : "border border-gray-300 bg-white"
              )}>
                <div className="flex items-center">
                  <span className="text-xl font-semibold text-orange-500">51</span>
                  <p className="ml-2 text-sm font-medium" style={{ color: isDarkTheme ? "#f3f4f6" : "#4a5568" }}>Installed but not published</p>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "mt-6 rounded-lg shadow-sm overflow-hidden border",
            isDarkTheme ? "border-gray-700" : "border-gray-300"
          )}>
            <div className="p-3 flex justify-between items-center">
              <h2 className={cn(
                "font-medium",
                isDarkTheme ? "text-white" : "text-gray-800"
              )}>
                Applications
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFilters}
                className={cn(
                  "flex items-center gap-1",
                  showFilters && "bg-blue-50 text-blue-600"
                )}
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>

            {showFilters && (
              <div className={cn(
                "px-3 py-2 border-t",
                isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
              )}>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {filters.map((filter, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded text-xs",
                        isDarkTheme ? "bg-gray-700" : "bg-blue-50"
                      )}
                    >
                      <span>{filter.field}: {filter.value}</span>
                      <button 
                        className="ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => removeFilter(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 items-center">
                  <select 
                    value={filterInput.field}
                    onChange={(e) => setFilterInput({...filterInput, field: e.target.value})}
                    className={cn(
                      "text-sm rounded border px-2 py-1",
                      isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    )}
                  >
                    <option value="applicationName">Application Name</option>
                    <option value="vendor">Vendor</option>
                    <option value="version">Version</option>
                    <option value="category">Category</option>
                    <option value="inventoryStatus">Inventory Status</option>
                    <option value="publishStatus">Publish Status</option>
                  </select>
                  <Input 
                    type="text" 
                    value={filterInput.value}
                    onChange={(e) => setFilterInput({...filterInput, value: e.target.value})}
                    placeholder="Filter value..." 
                    className="text-sm"
                  />
                  <Button variant="outline" size="sm" onClick={addFilter}>Add</Button>
                </div>
              </div>
            )}

            <div className="overflow-auto" style={{ maxWidth: "100%" }}>
              <div className="overflow-y-auto max-h-[600px] relative" style={{ scrollbarWidth: 'thin' }}>
                <style jsx global>{`
                  /* Custom scrollbar styles */
                  .overflow-y-auto::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                    background: transparent;
                  }
                  .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 20px;
                  }
                  .overflow-y-auto:hover::-webkit-scrollbar-thumb {
                    background: #9ca3af;
                  }
                  .overflow-y-auto.dark::-webkit-scrollbar-thumb {
                    background: #4b5563;
                  }
                  .overflow-y-auto.dark:hover::-webkit-scrollbar-thumb {
                    background: #6b7280;
                  }
                `}</style>
                <table className="w-full">
                  <thead className={cn(
                    "sticky top-0 z-10",
                    isDarkTheme ? "bg-gray-800" : "bg-gray-100"
                  )}>
                    <tr className={isDarkTheme ? "border-b border-gray-700" : "border-b border-gray-300"}>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap relative group",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        <div className="flex items-center">
                          <input type="checkbox" className="rounded" />
                          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group-hover:bg-blue-500"></div>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium relative group",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        <div className="flex items-center">
                          Application Name
                          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group-hover:bg-blue-500"></div>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium relative group",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        <div className="flex items-center">
                          Vendor
                          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group-hover:bg-blue-500"></div>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium relative group",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        <div className="flex items-center">
                          Latest Version
                          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group-hover:bg-blue-500"></div>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium relative group",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        <div className="flex items-center">
                          Release date
                          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group-hover:bg-blue-500"></div>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium relative group",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        <div className="flex items-center">
                          Category
                          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group-hover:bg-blue-500"></div>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium relative group",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        <div className="flex items-center">
                          Inventory Status
                          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group-hover:bg-blue-500"></div>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium relative group",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        <div className="flex items-center">
                          Publish Status
                          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group-hover:bg-blue-500"></div>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        Publish Task
                      </th>
                    </tr>
                  </thead>
                  <tbody className={isDarkTheme ? "text-gray-300" : "text-gray-800"}>
                    {filteredData.map((item, index) => (
                      <tr key={index} className={cn(
                        isDarkTheme ? "hover:bg-gray-800/50" : "hover:bg-gray-100"
                      )}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={index === 0} className="rounded" />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img src="/src/resources/2chrome.png" alt="" className="w-6 h-6" />
                            {item.applicationName}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{item.vendor}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{item.version}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{item.releaseDate}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{item.inventoryStatus}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {item.publishStatus === 'Updates Published' ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Check className="w-4 h-4" />
                              Updates Published
                            </span>
                          ) : item.publishStatus === 'Pending' ? (
                            <span className="text-orange-500">Pending</span>
                          ) : (
                            <span className="text-gray-500">Not Published</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <a href="#" className="text-blue-500 hover:underline">{item.publishTask}</a>
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
              <div>1-30 of 85 items</div>
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
