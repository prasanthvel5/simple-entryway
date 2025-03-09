
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Check, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type WizardStep = "selectApplications" | "assignmentSettings" | "installationSettings" | "publishSettings" | "review";

interface Application {
  applicationName: string;
  vendor: string;
  version: string;
  releaseDate: string;
  category: string;
  inventoryStatus: string;
  publishStatus: string;
  publishTask: string;
  id?: string; // Added for easier tracking
}

const PublishTaskWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<WizardStep>("selectApplications");
  const [applications, setApplications] = useState<Application[]>(location.state?.selectedApplications || []);
  const [taskName, setTaskName] = useState<string>("");
  const [showAddApplicationsDialog, setShowAddApplicationsDialog] = useState(false);
  const [selectedCatalogApps, setSelectedCatalogApps] = useState<Application[]>([]);
  const isDarkTheme = location.state?.isDarkTheme || false;
  
  const steps = [
    { id: "selectApplications", label: "Select Applications" },
    { id: "assignmentSettings", label: "Assignment Settings" },
    { id: "installationSettings", label: "Installation Settings" },
    { id: "publishSettings", label: "Publish Settings" },
    { id: "review", label: "Review & Save" },
  ];

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as WizardStep);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as WizardStep);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleRemoveApplication = (index: number) => {
    const newApplications = [...applications];
    newApplications.splice(index, 1);
    setApplications(newApplications);
  };

  // Sample applications for "Add Applications" functionality
  const catalogApplications: Application[] = [
    {
      id: "1",
      applicationName: "Microsoft Office",
      vendor: "Microsoft",
      version: "365",
      releaseDate: "May 15, 2024",
      category: "Productivity",
      inventoryStatus: "Not Installed",
      publishStatus: "Not Published",
      publishTask: "Task 2"
    },
    {
      id: "2",
      applicationName: "Adobe Photoshop",
      vendor: "Adobe",
      version: "25.2.0",
      releaseDate: "Apr 10, 2024",
      category: "Design",
      inventoryStatus: "Installed",
      publishStatus: "Updates Published",
      publishTask: "Task 3"
    },
    {
      id: "3",
      applicationName: "Visual Studio Code",
      vendor: "Microsoft",
      version: "1.84.2",
      releaseDate: "May 2, 2024",
      category: "Development",
      inventoryStatus: "Installed",
      publishStatus: "Not Published",
      publishTask: "Task 4"
    },
    {
      id: "4",
      applicationName: "Google Chrome",
      vendor: "Google",
      version: "123.0.6312.86",
      releaseDate: "May 5, 2024",
      category: "Browser",
      inventoryStatus: "Installed",
      publishStatus: "Not Published",
      publishTask: "Task 5"
    },
    {
      id: "5",
      applicationName: "Mozilla Firefox",
      vendor: "Mozilla",
      version: "124.0.1",
      releaseDate: "Apr 29, 2024",
      category: "Browser",
      inventoryStatus: "Not Installed",
      publishStatus: "Not Published",
      publishTask: "Task 6"
    }
  ];

  const toggleCatalogAppSelection = (app: Application) => {
    setSelectedCatalogApps(prev => {
      const isSelected = prev.some(a => a.id === app.id);
      if (isSelected) {
        return prev.filter(a => a.id !== app.id);
      } else {
        return [...prev, app];
      }
    });
  };

  const handleAddSelectedApplications = () => {
    // Add selected catalog apps to the applications list
    const newApps = selectedCatalogApps.filter(
      app => !applications.some(a => a.id === app.id)
    );
    
    if (newApps.length > 0) {
      setApplications([...applications, ...newApps]);
    }
    
    // Reset and close dialog
    setSelectedCatalogApps([]);
    setShowAddApplicationsDialog(false);
  };

  return (
    // Main container for the wizard inside left menu
    <div className={cn(
      "h-full flex flex-col",
      isDarkTheme ? "bg-gray-800 text-white" : "bg-[#f5f5f7] text-gray-800"
    )}>
      {/* Breadcrumb navigation */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Intune / Publish Tasks / Create Task
        </div>
      </div>

      {/* Task name input */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          <div>
            <label className={cn(
              "block text-sm font-medium mb-1",
              isDarkTheme ? "text-gray-300" : "text-gray-700"
            )}>
              Task Name:
            </label>
            <Input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="My Task 1"
              className="w-full"
            />
          </div>
          <div>
            <label className={cn(
              "block text-sm font-medium mb-1",
              isDarkTheme ? "text-gray-300" : "text-gray-700"
            )}>
              Task Type:
            </label>
            <div className={cn(
              "px-3 py-2 border rounded-md",
              isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"
            )}>
              Updates Deployment
            </div>
          </div>
        </div>
      </div>

      {/* Step indicator tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {steps.map((step, index) => (
          <button
            key={step.id}
            className={cn(
              "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
              currentStep === step.id 
                ? "border-blue-500 text-blue-600 dark:text-blue-400" 
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
            onClick={() => setCurrentStep(step.id as WizardStep)}
          >
            <div className="flex flex-col items-center">
              <div className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full mb-1",
                currentStep === step.id 
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400" 
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              )}>
                {index + 1}
              </div>
              <span className="hidden sm:inline">{step.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Step content scrollable area */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentStep === "selectApplications" && (
          <div className="space-y-4">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-medium">Selected Applications</h3>
              <Button 
                size="xs"
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
                onClick={() => setShowAddApplicationsDialog(true)}
              >
                <Plus className="h-3 w-3" />
                Add Applications
              </Button>
            </div>
            
            <div className={cn(
              "overflow-hidden rounded-lg border", 
              isDarkTheme ? "border-gray-700" : "border-gray-200"
            )}>
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={cn(
                  isDarkTheme ? "bg-gray-700" : "bg-gray-100"
                )}>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                      Application Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={cn(
                  "divide-y",
                  isDarkTheme ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"
                )}>
                  {applications.length > 0 ? (
                    applications.map((app, index) => (
                      <tr key={index} className={isDarkTheme ? "hover:bg-gray-750" : "hover:bg-gray-50"}>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">
                          <div className="flex items-center gap-2">
                            <img src="/src/resources/2chrome.png" alt="" className="w-5 h-5" />
                            {app.applicationName}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{app.vendor}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs">{app.version}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <Button 
                            variant="ghost" 
                            size="xs"
                            onClick={() => handleRemoveApplication(index)}
                            className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-center text-xs">
                        No applications selected. Click "Add Applications" to select.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentStep === "assignmentSettings" && (
          <div>
            <h3 className="text-sm font-medium mb-4">Assignment Settings</h3>
            <div className={cn(
              "p-4 rounded-lg border",
              isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
            )}>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium mb-1">Assignment Type</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="radio" name="assignmentType" id="required" className="mr-2" defaultChecked />
                      <label htmlFor="required">Required - Will force install on devices</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="assignmentType" id="available" className="mr-2" />
                      <label htmlFor="available">Available - Will make available for user-driven installation</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="assignmentType" id="uninstall" className="mr-2" />
                      <label htmlFor="uninstall">Uninstall - Will remove if installed</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Assign to</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="allUsers" className="mr-2" />
                      <label htmlFor="allUsers">All Users</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="specificGroups" className="mr-2" defaultChecked />
                      <label htmlFor="specificGroups">Specific Groups</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Selected Groups</label>
                  <select className={cn(
                    "block w-full rounded-md border px-3 py-1 text-xs",
                    isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                  )} multiple size={3}>
                    <option>Marketing Department</option>
                    <option>Sales Team</option>
                    <option>Engineering</option>
                    <option>Human Resources</option>
                    <option>Executive Team</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === "installationSettings" && (
          <div>
            <h3 className="text-sm font-medium mb-4">Installation Settings</h3>
            <div className={cn(
              "p-4 rounded-lg border",
              isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
            )}>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium mb-1">Installation Behavior</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="radio" name="installBehavior" id="system" className="mr-2" defaultChecked />
                      <label htmlFor="system">System context (recommended)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="installBehavior" id="user" className="mr-2" />
                      <label htmlFor="user">User context</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Installation Requirements</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="deviceRestart" className="mr-2" />
                      <label htmlFor="deviceRestart">Device restart required</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="diskSpace" className="mr-2" defaultChecked />
                      <label htmlFor="diskSpace">Minimum disk space (GB):</label>
                      <input 
                        type="number" 
                        className={cn(
                          "ml-2 w-12 rounded-md border px-2 py-1 text-xs",
                          isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                        )}
                        defaultValue="1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Installation Timing</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="radio" name="installTiming" id="immediate" className="mr-2" defaultChecked />
                      <label htmlFor="immediate">Immediate</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="installTiming" id="deadline" className="mr-2" />
                      <label htmlFor="deadline">With deadline</label>
                    </div>
                    <div className="ml-6">
                      <label className="block text-sm mb-1">Deadline (days):</label>
                      <input 
                        type="number" 
                        className={cn(
                          "w-12 rounded-md border px-2 py-1 text-xs",
                          isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                        )}
                        defaultValue="5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === "publishSettings" && (
          <div>
            <h3 className="text-sm font-medium mb-4">Publish Settings</h3>
            <div className={cn(
              "p-4 rounded-lg border",
              isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
            )}>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium mb-1">Publish Schedule</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="radio" name="publishSchedule" id="immediatePublish" className="mr-2" defaultChecked />
                      <label htmlFor="immediatePublish">Publish immediately</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="publishSchedule" id="scheduled" className="mr-2" />
                      <label htmlFor="scheduled">Scheduled</label>
                    </div>
                  </div>
                </div>

                <div className="ml-6">
                  <label className="block text-sm mb-1">Start Date:</label>
                  <input 
                    type="date" 
                    className={cn(
                      "rounded-md border px-2 py-1 text-xs",
                      isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    )}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Notification Settings</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="endUserNotification" className="mr-2" defaultChecked />
                      <label htmlFor="endUserNotification">Show end-user notifications</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="customMessage" className="mr-2" />
                      <label htmlFor="customMessage">Use custom notification message</label>
                    </div>
                  </div>
                </div>

                <div className="ml-6">
                  <label className="block text-sm mb-1">Custom Message:</label>
                  <textarea 
                    className={cn(
                      "w-full rounded-md border px-2 py-1 text-xs",
                      isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    )}
                    rows={2}
                    placeholder="Enter your custom notification message here..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === "review" && (
          <div>
            <h3 className="text-sm font-medium mb-4">Review and Save</h3>
            <div className={cn(
              "p-4 rounded-lg border",
              isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
            )}>
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-medium mb-1">Task Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Task Name</span>
                      <span>{taskName || "My Task 1"}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Task Type</span>
                      <span>Updates Deployment</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Selected Applications ({applications.length})</h4>
                  <ul className="list-disc ml-5 space-y-1">
                    {applications.map((app, index) => (
                      <li key={index}>{app.applicationName} ({app.version})</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Assignment Settings</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Assignment Type</span>
                      <span>Required</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Assigned Groups</span>
                      <span>Marketing Department, Sales Team</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Installation Settings</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Installation Context</span>
                      <span>System context</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Installation Timing</span>
                      <span>Immediate</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Disk Space Required</span>
                      <span>1 GB</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Publish Settings</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">Publish Schedule</span>
                      <span>Immediate</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 dark:text-gray-400">End-User Notifications</span>
                      <span>Enabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleCancel}
          className={isDarkTheme ? "bg-gray-700 border-gray-600 text-sm" : "text-sm"}
        >
          Cancel
        </Button>
        
        {currentStep !== "selectApplications" && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleBack}
            className={cn(
              "flex items-center gap-1 text-sm",
              isDarkTheme ? "bg-gray-700 border-gray-600" : ""
            )}
          >
            <ArrowLeft className="h-3 w-3" />
            Previous
          </Button>
        )}
        
        {currentStep !== "review" ? (
          <Button 
            onClick={handleNext}
            size="sm"
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-sm"
          >
            Next
            <ArrowRight className="h-3 w-3" />
          </Button>
        ) : (
          <Button 
            onClick={() => {
              // Handle save functionality
              navigate('/dashboard');
            }}
            size="sm"
            className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-sm"
          >
            Create Task
            <Check className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Add Applications Dialog */}
      <Dialog open={showAddApplicationsDialog} onOpenChange={setShowAddApplicationsDialog}>
        <DialogContent className={cn(
          "max-w-2xl",
          isDarkTheme ? "bg-gray-800 text-white" : "bg-white"
        )}>
          <h2 className="text-lg font-semibold mb-4">Updates Catalog</h2>
          
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search applications..."
                className="pl-10"
              />
            </div>
          </div>

          <div className={cn(
            "overflow-hidden rounded-lg border mb-4", 
            isDarkTheme ? "border-gray-700" : "border-gray-200"
          )}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={cn(
                isDarkTheme ? "bg-gray-700" : "bg-gray-100"
              )}>
                <tr>
                  <th className="px-4 py-2 w-8">
                    <span className="sr-only">Select</span>
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                    Application Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                    Release Date
                  </th>
                </tr>
              </thead>
              <tbody className={cn(
                "divide-y",
                isDarkTheme ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"
              )}>
                {catalogApplications.map((app) => {
                  const isSelected = selectedCatalogApps.some(a => a.id === app.id);
                  const isAlreadyAdded = applications.some(a => a.id === app.id);
                  
                  return (
                    <tr 
                      key={app.id} 
                      className={cn(
                        isDarkTheme ? "hover:bg-gray-750" : "hover:bg-gray-50",
                        isAlreadyAdded && "opacity-50"
                      )}
                    >
                      <td className="px-4 py-2 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          disabled={isAlreadyAdded}
                          onChange={() => toggleCatalogAppSelection(app)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img src="/src/resources/2chrome.png" alt="" className="w-5 h-5" />
                          {app.applicationName}
                          {isAlreadyAdded && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              (Already added)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">{app.vendor}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{app.version}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{app.releaseDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between">
            <div className="text-sm">
              {selectedCatalogApps.length} application(s) selected
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddApplicationsDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleAddSelectedApplications}
                disabled={selectedCatalogApps.length === 0}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Add Selected
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublishTaskWizard;
