
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
}

const PublishTaskWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<WizardStep>("selectApplications");
  const [applications, setApplications] = useState<Application[]>(location.state?.selectedApplications || []);
  const [taskName, setTaskName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAddApplicationsDialog, setShowAddApplicationsDialog] = useState(false);
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
  const availableApplications: Application[] = [
    {
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
      applicationName: "Visual Studio Code",
      vendor: "Microsoft",
      version: "1.84.2",
      releaseDate: "May 2, 2024",
      category: "Development",
      inventoryStatus: "Installed",
      publishStatus: "Not Published",
      publishTask: "Task 4"
    }
  ];

  const filteredApplications = availableApplications.filter(app => 
    app.applicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddApplication = (app: Application) => {
    if (!applications.some(a => a.applicationName === app.applicationName)) {
      setApplications([...applications, app]);
    }
    setShowAddApplicationsDialog(false);
  };

  return (
    <div className={cn(
      "min-h-screen",
      isDarkTheme ? "bg-gray-900 text-white" : "bg-[#f5f5f7] text-gray-800"
    )}>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-500">Intune / Publish Tasks / Create Task</span>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-4">
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
                    className="w-64"
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
          </div>
          
          {/* Wizard Progress Bar */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex flex-col items-center relative">
                {/* Connector line */}
                {index > 0 && (
                  <div className={cn(
                    "absolute h-1 top-4 -left-1/2 right-1/2",
                    index <= steps.findIndex(s => s.id === currentStep) 
                      ? "bg-green-500" 
                      : "bg-gray-300"
                  )} />
                )}
                
                {/* Step circle */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center z-10 mb-1 font-medium",
                  currentStep === step.id 
                    ? "bg-blue-500 text-white" 
                    : index < steps.findIndex(s => s.id === currentStep)
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-700"
                )}>
                  {index < steps.findIndex(s => s.id === currentStep) 
                    ? <Check className="h-4 w-4" /> 
                    : index + 1}
                </div>
                
                {/* Step label */}
                <span className={cn(
                  "text-sm text-center",
                  currentStep === step.id 
                    ? "text-blue-500 font-medium" 
                    : index < steps.findIndex(s => s.id === currentStep)
                      ? "text-green-500" 
                      : isDarkTheme 
                        ? "text-gray-400" 
                        : "text-gray-600"
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          {currentStep === "selectApplications" && (
            <div className="space-y-4">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Selected Applications</h3>
                <Button 
                  size="sm"
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
                  onClick={() => setShowAddApplicationsDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Applications
                </Button>
              </div>
              
              <div className={cn(
                "overflow-hidden rounded-lg border", 
                isDarkTheme ? "border-gray-700" : "border-gray-200"
              )}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={cn(
                    isDarkTheme ? "bg-gray-700" : "bg-gray-100"
                  )}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Application Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Latest Version
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <img src="/src/resources/2chrome.png" alt="" className="w-6 h-6" />
                              {app.applicationName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{app.vendor}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{app.version}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {app.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button 
                              variant="ghost" 
                              size="xs"
                              onClick={() => handleRemoveApplication(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          No applications selected. Click "Add Applications" to select applications.
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
              <h3 className="text-lg font-medium mb-4">Assignment Settings</h3>
              <div className={cn(
                "p-6 rounded-lg border",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Assignment Type</label>
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
                    <label className="block text-sm font-medium mb-1">Assign to</label>
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
                    <label className="block text-sm font-medium mb-1">Selected Groups</label>
                    <select className={cn(
                      "mt-1 block w-full rounded-md border px-3 py-2",
                      isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                    )} multiple>
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
              <h3 className="text-lg font-medium mb-4">Installation Settings</h3>
              <div className={cn(
                "p-6 rounded-lg border",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Installation Behavior</label>
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
                    <label className="block text-sm font-medium mb-1">Installation Requirements</label>
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
                            "ml-2 w-16 rounded-md border px-2 py-1",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                          )}
                          defaultValue="1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Installation Timing</label>
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
                        <label className="block text-sm mb-1">Deadline (days after assignment):</label>
                        <input 
                          type="number" 
                          className={cn(
                            "w-16 rounded-md border px-2 py-1",
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
              <h3 className="text-lg font-medium mb-4">Publish Settings</h3>
              <div className={cn(
                "p-6 rounded-lg border",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Publish Schedule</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="radio" name="publishSchedule" id="immediate" className="mr-2" defaultChecked />
                        <label htmlFor="immediate">Publish immediately</label>
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
                        "rounded-md border px-3 py-2",
                        isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Notification Settings</label>
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
                        "w-full rounded-md border px-3 py-2",
                        isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                      )}
                      rows={3}
                      placeholder="Enter your custom notification message here..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === "review" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Review and Save</h3>
              <div className={cn(
                "p-6 rounded-lg border",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Task Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-sm text-gray-500">Task Name</span>
                        <span>{taskName || "My Task 1"}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Task Type</span>
                        <span>Updates Deployment</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Selected Applications ({applications.length})</h4>
                    <ul className="list-disc ml-5 space-y-1">
                      {applications.map((app, index) => (
                        <li key={index}>{app.applicationName} ({app.version})</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Assignment Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-sm text-gray-500">Assignment Type</span>
                        <span>Required</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Assigned Groups</span>
                        <span>Marketing Department, Sales Team</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Installation Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-sm text-gray-500">Installation Context</span>
                        <span>System context</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Installation Timing</span>
                        <span>Immediate</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Disk Space Required</span>
                        <span>1 GB</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Publish Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-sm text-gray-500">Publish Schedule</span>
                        <span>Immediate</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">End-User Notifications</span>
                        <span>Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
          >
            Cancel
          </Button>
          
          {currentStep !== "selectApplications" && (
            <Button 
              variant="outline" 
              onClick={handleBack}
              className={cn(
                "flex items-center gap-1",
                isDarkTheme ? "bg-gray-700 border-gray-600" : ""
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          
          {currentStep !== "review" ? (
            <Button 
              onClick={handleNext}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => {
                // Handle save functionality
                navigate('/dashboard');
              }}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
            >
              Create Task
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Add Applications Dialog */}
      <Dialog open={showAddApplicationsDialog} onOpenChange={setShowAddApplicationsDialog}>
        <DialogContent className={cn(
          "max-w-2xl p-6",
          isDarkTheme ? "bg-gray-800 text-white" : "bg-white"
        )}>
          <h2 className="text-xl font-semibold mb-4">Add Applications</h2>
          
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search applications..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={cn(
            "overflow-hidden rounded-lg border mb-4", 
            isDarkTheme ? "border-gray-700" : "border-gray-200"
          )}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={cn(
                isDarkTheme ? "bg-gray-700" : "bg-gray-100"
              )}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Application Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={cn(
                "divide-y",
                isDarkTheme ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"
              )}>
                {filteredApplications.map((app, index) => (
                  <tr key={index} className={isDarkTheme ? "hover:bg-gray-750" : "hover:bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img src="/src/resources/2chrome.png" alt="" className="w-6 h-6" />
                        {app.applicationName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{app.vendor}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{app.version}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button 
                        variant="ghost" 
                        size="xs"
                        onClick={() => handleAddApplication(app)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowAddApplicationsDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublishTaskWizard;
