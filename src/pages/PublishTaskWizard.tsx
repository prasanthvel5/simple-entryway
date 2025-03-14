import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";

interface PublishTaskWizardProps {
  isDarkTheme: boolean;
  activeMenu: string;
  activeSecondLevel: string;
}

interface TaskData {
  taskName: string;
  taskType: "Updates Deployment" | "Applications Deployment";
  selectedApplications: string[];
  assignmentType: string;
  requiredGroups: string[];
  schedule: string;
}

const PublishTaskWizard = () => {
  const { isDarkTheme } = useOutletContext<PublishTaskWizardProps>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [taskData, setTaskData] = useState<TaskData>({
    taskName: "Publish Task " + Math.floor(Math.random() * 100),
    taskType: "Updates Deployment",
    selectedApplications: ["Google Chrome", "Notepad++", "and 30 more"],
    assignmentType: "Enabled",
    requiredGroups: ["Test group", "remote office"],
    schedule: "Daily at 3.00 PM"
  });

  const handleFinish = () => {
    // Get existing tasks from localStorage
    const existingTasks = localStorage.getItem("publishedTasks");
    const tasks = existingTasks ? JSON.parse(existingTasks) : [];
    
    // Create a new task object
    const newTask = {
      id: tasks.length + 1,
      title: taskData.taskName,
      type: taskData.taskType,
      selectedApplications: taskData.selectedApplications.join(", "),
      automatedAssignment: taskData.assignmentType,
      requiredGroups: taskData.requiredGroups.join(", "),
      availableGroups: "None",
      publishScheduler: taskData.schedule,
      createdTime: "3.40 PM, 2 August 2024",
      lastRunTime: "3.00 PM, 3 August 2024",
      nextRunTime: "3.00 PM, 4 August 2024",
      remarks: "All updates has been published successfully",
      status: "Active"
    };
    
    // Add the new task to the tasks array
    tasks.push(newTask);
    
    // Save the updated tasks array to localStorage
    localStorage.setItem("publishedTasks", JSON.stringify(tasks));
    
    // Show success toast
    toast({
      title: "Task Created",
      description: "Your publish task has been created successfully",
      variant: "default",
    });
    
    // Navigate to the published tasks page
    navigate("/dashboard/published-task");
  };

  const steps = [
    { id: 1, name: "Task Details" },
    { id: 2, name: "Application Selection" },
    { id: 3, name: "Assignment" },
    { id: 4, name: "Schedule" },
    { id: 5, name: "Review" },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className={cn(
              "rounded-lg border p-6",
              isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
              <h3 className="text-lg font-medium mb-4">Task Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task Name</label>
                  <input 
                    type="text" 
                    value={taskData.taskName}
                    onChange={(e) => setTaskData({...taskData, taskName: e.target.value})}
                    className={cn(
                      "w-full rounded-md border p-2",
                      isDarkTheme 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Task Type</label>
                  <select 
                    value={taskData.taskType}
                    onChange={(e) => setTaskData({...taskData, taskType: e.target.value as any})}
                    className={cn(
                      "w-full rounded-md border p-2",
                      isDarkTheme 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  >
                    <option value="Updates Deployment">Updates Deployment</option>
                    <option value="Applications Deployment">Applications Deployment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    className={cn(
                      "w-full rounded-md border p-2",
                      isDarkTheme 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                    rows={3}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className={cn(
              "rounded-lg border p-6",
              isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
              <h3 className="text-lg font-medium mb-4">Application Selection</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Selected Applications: {taskData.selectedApplications.length}</span>
                  <Button variant="outline" size="sm" className="dark:border-gray-600">
                    Select All
                  </Button>
                </div>
                <div className={cn(
                  "border rounded-md p-4 max-h-60 overflow-y-auto",
                  isDarkTheme ? "border-gray-700" : "border-gray-300"
                )}>
                  <ul className="space-y-2">
                    {["Google Chrome", "Microsoft Edge", "Firefox", "Notepad++", "Visual Studio Code"].map((app, index) => (
                      <li key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={`app-${index}`} 
                            checked={true}
                            className="rounded"
                          />
                          <label htmlFor={`app-${index}`}>{app}</label>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">v1.0.{index}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className={cn(
              "rounded-lg border p-6",
              isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
              <h3 className="text-lg font-medium mb-4">Assignment Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Assignment Type</label>
                  <select 
                    value={taskData.assignmentType}
                    onChange={(e) => setTaskData({...taskData, assignmentType: e.target.value})}
                    className={cn(
                      "w-full rounded-md border p-2",
                      isDarkTheme 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  >
                    <option value="Enabled">Enabled</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Required Groups</label>
                  <select 
                    multiple
                    className={cn(
                      "w-full rounded-md border p-2 h-32",
                      isDarkTheme 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  >
                    <option value="group1">All Users</option>
                    <option value="group2">Test Group</option>
                    <option value="group3">Remote Office</option>
                    <option value="group4">Marketing</option>
                    <option value="group5">Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Available Groups</label>
                  <select 
                    multiple
                    className={cn(
                      "w-full rounded-md border p-2 h-32",
                      isDarkTheme 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  >
                    <option value="group1">All Users</option>
                    <option value="group2">Test Group</option>
                    <option value="group3">Remote Office</option>
                    <option value="group4">Marketing</option>
                    <option value="group5">Engineering</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className={cn(
              "rounded-lg border p-6",
              isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
              <h3 className="text-lg font-medium mb-4">Schedule Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Schedule Type</label>
                  <select 
                    className={cn(
                      "w-full rounded-md border p-2",
                      isDarkTheme 
                        ? "bg-gray-700 border-gray-600 text-white" 
                        : "bg-white border-gray-300"
                    )}
                  >
                    <option value="once">Run Once</option>
                    <option value="daily" selected>Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input 
                      type="date" 
                      className={cn(
                        "w-full rounded-md border p-2",
                        isDarkTheme 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-white border-gray-300"
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Time</label>
                    <input 
                      type="time" 
                      className={cn(
                        "w-full rounded-md border p-2",
                        isDarkTheme 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-white border-gray-300"
                      )}
                      defaultValue="15:00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Recurrence</label>
                  <div className="flex items-center gap-2">
                    <span>Repeat every</span>
                    <input 
                      type="number" 
                      min="1" 
                      max="31" 
                      defaultValue="1"
                      className={cn(
                        "w-16 rounded-md border p-2",
                        isDarkTheme 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-white border-gray-300"
                      )}
                    />
                    <span>day(s)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className={cn(
              "rounded-lg border p-6",
              isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
              <h3 className="text-lg font-medium mb-4">Review Task</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="border-b pb-2 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Task Name:</span>
                  </div>
                  <div className="border-b pb-2 dark:border-gray-700 font-medium">
                    {taskData.taskName}
                  </div>
                  
                  <div className="border-b pb-2 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Task Type:</span>
                  </div>
                  <div className="border-b pb-2 dark:border-gray-700 font-medium">
                    {taskData.taskType}
                  </div>
                  
                  <div className="border-b pb-2 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Selected Applications:</span>
                  </div>
                  <div className="border-b pb-2 dark:border-gray-700 font-medium">
                    {taskData.selectedApplications.join(", ")}
                  </div>
                  
                  <div className="border-b pb-2 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Assignment Type:</span>
                  </div>
                  <div className="border-b pb-2 dark:border-gray-700 font-medium">
                    {taskData.assignmentType}
                  </div>
                  
                  <div className="border-b pb-2 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Required Groups:</span>
                  </div>
                  <div className="border-b pb-2 dark:border-gray-700 font-medium">
                    {taskData.requiredGroups.join(", ")}
                  </div>
                  
                  <div className="border-b pb-2 dark:border-gray-700">
                    <span className="text-gray-500 dark:text-gray-400">Schedule:</span>
                  </div>
                  <div className="border-b pb-2 dark:border-gray-700 font-medium">
                    {taskData.schedule}
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-900/30">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    Please review the task details above. Once you click "Finish", the task will be created and scheduled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex-1 p-6 transition-colors",
      isDarkTheme ? "bg-gray-900 text-white" : "bg-[#f5f5f7] text-gray-800"
    )}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Publish Task</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Configure your task settings and publish applications to Intune
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          {steps.map((step, i) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    currentStep > step.id 
                      ? "bg-green-500 text-white" 
                      : currentStep === step.id 
                        ? isDarkTheme ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
                        : isDarkTheme ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                  )}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span 
                  className={cn(
                    "ml-2 text-sm font-medium",
                    currentStep === step.id 
                      ? isDarkTheme ? "text-blue-400" : "text-blue-600"
                      : isDarkTheme ? "text-gray-400" : "text-gray-600"
                  )}
                >
                  {step.name}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    currentStep > step.id 
                      ? "bg-green-500" 
                      : isDarkTheme ? "bg-gray-700" : "bg-gray-200"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {renderStepContent()}
      
      <div className="mt-6 flex justify-between">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="dark:border-gray-600 dark:text-white"
          >
            Previous
          </Button>
        )}
        
        {currentStep < 5 ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            className="ml-auto dark:bg-blue-600"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleFinish}
            className="ml-auto bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
          >
            Finish
          </Button>
        )}
      </div>
    </div>
  );
};

export default PublishTaskWizard;
