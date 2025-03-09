import { cn } from "@/lib/utils";
import { Check, Filter, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface MainContentProps {
  isDarkTheme: boolean;
  activeMenu: string;
  activeSecondLevel: string;
}

interface FilterCriteria {
  field: string;
  value: string;
}

interface ApplicationData {
  applicationName: string;
  vendor: string;
  version: string;
  releaseDate: string;
  category: string;
  inventoryStatus: string;
  publishStatus: string;
  publishTask: string;
}

export const MainContent = ({ isDarkTheme, activeMenu, activeSecondLevel }: MainContentProps) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const [filterInput, setFilterInput] = useState<FilterCriteria>({ field: "applicationName", value: "" });
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

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

  const handleRowSelect = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(filteredData.map((_, index) => index));
    } else {
      setSelectedRows([]);
    }
  };

  const handleCreatePublishTask = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "No applications selected",
        description: "Please select at least one application to create a publish task.",
        variant: "destructive",
      });
      return;
    }
    
    navigate('publish-task-wizard', { 
      state: { 
        selectedApplications: selectedRows.map(index => filteredData[index])
      }
    });
  };

  if (activeMenu === "intune" && activeSecondLevel === "Updates Catalog") {
    return (
      <main className={cn(
        "flex-1 p-6 transition-colors relative",
        isDarkTheme ? "bg-gray-900 text-white" : "bg-[#f5f5f7] text-gray-800"
      )}>
        <div className={cn(
          "absolute inset-0",
          isDarkTheme ? "bg-gray-900" : "bg-[#f5f5f7]"
        )} />
        <div className="relative z-10">
          <div className="space-y-6">
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
              onClick={handleCreatePublishTask}
            >
              Create Publish Task
            </button>
            
            <div className="grid grid-cols-4 gap-4">
              <div className={cn(
                "rounded-lg p-4 shadow-sm",
                isDarkTheme ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/20 p-1.5 rounded">
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xl font-semibold text-blue-500">1050</span>
                      <p className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-300">Total Applications</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={cn(
                "rounded-lg p-4 shadow-sm",
                isDarkTheme ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              )}>
                <div className="flex items-center gap-2">
                  <div className="bg-blue-500/20 p-1.5 rounded">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-blue-500">75</span>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Installed</p>
                  </div>
                </div>
              </div>
              <div className={cn(
                "rounded-lg p-4 shadow-sm",
                isDarkTheme ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              )}>
                <div className="flex items-center gap-2">
                  <div className="bg-green-500/20 p-1.5 rounded">
                    <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-green-500">24</span>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Update Published</p>
                  </div>
                </div>
              </div>
              <div className={cn(
                "rounded-lg p-4 shadow-sm",
                isDarkTheme ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
              )}>
                <div className="flex items-center gap-2">
                  <div className="bg-orange-500/20 p-1.5 rounded">
                    <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
                  </div>
                  <div>
                    <span className="text-xl font-semibold text-orange-500">51</span>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Installed but not published</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cn(
            "mt-6 rounded-lg shadow-sm overflow-hidden border",
            isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            <div className="p-3 flex justify-between items-center">
              <h2 className={cn(
                "font-medium",
                isDarkTheme ? "text-white" : "text-gray-800"
              )}>
                Applications
              </h2>
            </div>

            {showFilters && (
              <div className={cn(
                "px-3 py-2 border-t",
                isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
              )}>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {filters.map((filter, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded text-xs",
                        isDarkTheme ? "bg-gray-600 text-gray-100" : "bg-blue-100 text-blue-800"
                      )}
                    >
                      <span className="font-medium">{filter.field}:</span> {filter.value}
                      <button 
                        className={cn(
                          "ml-1 hover:text-red-500",
                          isDarkTheme ? "text-gray-300" : "text-gray-600"
                        )}
                        onClick={() => removeFilter(idx)}
                      >
                        <X className="h-3 w-3" />
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
                      isDarkTheme ? "bg-gray-600 border-gray-500 text-white" : "bg-white border-gray-300 text-gray-800"
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
                    className={cn(
                      "text-sm",
                      isDarkTheme ? "bg-gray-600 border-gray-500 text-white" : "border-gray-300"
                    )}
                  />
                  <Button 
                    variant="filter" 
                    size="xs" 
                    onClick={addFilter}
                    className="flex items-center gap-1"
                  >
                    Add Filter
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-auto" style={{ maxWidth: "100%" }}>
              <div className="overflow-y-auto max-h-[600px] relative hide-scrollbar">
                <style>
                  {`
                  .hide-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                    opacity: 0;
                    transition: opacity 0.3s;
                  }
                  .hide-scrollbar:hover::-webkit-scrollbar {
                    opacity: 1;
                  }
                  .hide-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDarkTheme ? '#4b5563' : '#cbd5e0'};
                    border-radius: 20px;
                  }
                  .hide-scrollbar:hover::-webkit-scrollbar-thumb {
                    background: ${isDarkTheme ? '#6b7280' : '#a0aec0'};
                  }
                  `}
                </style>
                <table className="w-full">
                  <thead className={cn(
                    "sticky top-0 z-10 border-b",
                    isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"
                  )}>
                    <tr>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap border-r relative",
                        isDarkTheme ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                      )}>
                        <div className="flex items-center justify-between">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            onChange={handleSelectAll}
                            checked={selectedRows.length > 0 && selectedRows.length === filteredData.length}
                          />
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium border-r relative",
                        isDarkTheme ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                      )}>
                        <div className="flex items-center justify-between">
                          <span>Application Name</span>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => {
                              setFilterInput({field: "applicationName", value: ""});
                              toggleFilters();
                            }}
                            className={cn(
                              "p-1 h-6 w-6",
                              isDarkTheme ? "text-gray-300 hover:bg-gray-600" : "text-gray-600 hover:bg-gray-200"
                            )}
                          >
                            <Filter className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium border-r relative",
                        isDarkTheme ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                      )}>
                        <div className="flex items-center justify-between">
                          <span>Vendor</span>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => {
                              setFilterInput({field: "vendor", value: ""});
                              toggleFilters();
                            }}
                            className={cn(
                              "p-1 h-6 w-6",
                              isDarkTheme ? "text-gray-300 hover:bg-gray-600" : "text-gray-600 hover:bg-gray-200"
                            )}
                          >
                            <Filter className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium border-r relative",
                        isDarkTheme ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                      )}>
                        <div className="flex items-center justify-between">
                          <span>Latest Version</span>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => {
                              setFilterInput({field: "version", value: ""});
                              toggleFilters();
                            }}
                            className={cn(
                              "p-1 h-6 w-6",
                              isDarkTheme ? "text-gray-300 hover:bg-gray-600" : "text-gray-600 hover:bg-gray-200"
                            )}
                          >
                            <Filter className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium border-r relative",
                        isDarkTheme ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                      )}>
                        <div className="flex items-center justify-between">
                          <span>Release date</span>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => {
                              setFilterInput({field: "releaseDate", value: ""});
                              toggleFilters();
                            }}
                            className={cn(
                              "p-1 h-6 w-6",
                              isDarkTheme ? "text-gray-300 hover:bg-gray-600" : "text-gray-600 hover:bg-gray-200"
                            )}
                          >
                            <Filter className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium border-r relative",
                        isDarkTheme ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                      )}>
                        <div className="flex items-center justify-between">
                          <span>Category</span>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => {
                              setFilterInput({field: "category", value: ""});
                              toggleFilters();
                            }}
                            className={cn(
                              "p-1 h-6 w-6",
                              isDarkTheme ? "text-gray-300 hover:bg-gray-600" : "text-gray-600 hover:bg-gray-200"
                            )}
                          >
                            <Filter className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium border-r relative",
                        isDarkTheme ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                      )}>
                        <div className="flex items-center justify-between">
                          <span>Inventory Status</span>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => {
                              setFilterInput({field: "inventoryStatus", value: ""});
                              toggleFilters();
                            }}
                            className={cn(
                              "p-1 h-6 w-6",
                              isDarkTheme ? "text-gray-300 hover:bg-gray-600" : "text-gray-600 hover:bg-gray-200"
                            )}
                          >
                            <Filter className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium border-r relative",
                        isDarkTheme ? "text-gray-200 border-gray-600" : "text-gray-700 border-gray-300"
                      )}>
                        <div className="flex items-center justify-between">
                          <span>Publish Status</span>
                          <Button 
                            variant="ghost" 
                            size="xs" 
                            onClick={() => {
                              setFilterInput({field: "publishStatus", value: ""});
                              toggleFilters();
                            }}
                            className={cn(
                              "p-1 h-6 w-6",
                              isDarkTheme ? "text-gray-300 hover:bg-gray-600" : "text-gray-600 hover:bg-gray-200"
                            )}
                          >
                            <Filter className="h-3 w-3" />
                          </Button>
                        </div>
                      </th>
                      <th className={cn(
                        "px-4 py-3 text-left whitespace-nowrap font-medium",
                        isDarkTheme ? "text-gray-200" : "text-gray-700"
                      )}>
                        <span>Publish Task</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className={isDarkTheme ? "text-gray-300" : "text-gray-800"}>
                    {filteredData.map((item, index) => (
                      <tr key={index} className={cn(
                        selectedRows.includes(index) 
                          ? isDarkTheme ? "bg-blue-900/20" : "bg-blue-50" 
                          : "",
                        isDarkTheme ? "hover:bg-gray-750" : "hover:bg-gray-50"
                      )}>
                        <td className="px-4 py-3">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={selectedRows.includes(index)}
                            onChange={() => handleRowSelect(index)}
                          />
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
              isDarkTheme ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"
            )}>
              <div>1-30 of 85 items</div>
              <div className="flex items-center gap-2">
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : "border-gray-300"
                )} disabled>&lt;</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
                )}>1</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : "border-gray-300"
                )}>2</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : "border-gray-300"
                )}>3</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : "border-gray-300"
                )}>4</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : "border-gray-300"
                )}>5</button>
                <button className={cn(
                  "px-2 py-1 border rounded",
                  isDarkTheme ? "border-gray-600" : "border-gray-300"
                )}>&gt;</button>
                <select className={cn(
                  "border rounded px-2 py-1",
                  isDarkTheme ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
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
      "flex-1 p-6 transition-colors relative",
      isDarkTheme ? "bg-gray-900 text-white" : "bg-[#353640] text-white"
    )}>
      <div className={cn(
        "absolute inset-0",
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
