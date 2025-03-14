
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Pen, PowerOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface PublishTaskData {
  id: number;
  title: string;
  type: "Updates Deployment" | "Applications Deployment";
  selectedApplications: string;
  automatedAssignment: "Enabled" | "Disabled";
  requiredGroups: string;
  availableGroups: string;
  publishScheduler: string;
  createdTime: string;
  lastRunTime: string;
  nextRunTime: string;
  remarks: string;
  status: "Active" | "Disabled";
}

interface PublishedTaskProps {
  isDarkTheme: boolean;
}

const PublishedTask = ({ isDarkTheme }: PublishedTaskProps) => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<PublishTaskData[]>(() => {
    // Try to load tasks from localStorage
    const savedTasks = localStorage.getItem("publishedTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const handleCreateTask = () => {
    navigate("/dashboard/publish-task-wizard");
  };

  const handleModifyTask = (taskId: number) => {
    toast({
      title: "Modify Task",
      description: `You're modifying task #${taskId}`,
    });
  };

  const handleDisableTask = (taskId: number) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status === "Active" ? "Disabled" : "Active" } 
          : task
      )
    );
    
    // Update localStorage
    localStorage.setItem("publishedTasks", JSON.stringify(
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status === "Active" ? "Disabled" : "Active" } 
          : task
      )
    ));

    toast({
      title: "Task Status Updated",
      description: `Task #${taskId} has been ${tasks.find(t => t.id === taskId)?.status === "Active" ? "disabled" : "enabled"}`,
    });
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    
    // Update localStorage
    localStorage.setItem("publishedTasks", JSON.stringify(
      tasks.filter(task => task.id !== taskId)
    ));

    toast({
      title: "Task Deleted",
      description: `Task #${taskId} has been deleted`,
      variant: "destructive",
    });
  };

  const handleViewTask = (taskId: number) => {
    toast({
      title: "View Task Details",
      description: `Viewing task #${taskId} details`,
    });
  };

  const getBadgeColor = (type: string) => {
    return type === "Updates Deployment" 
      ? "bg-purple-500 text-white" 
      : "bg-red-400 text-white";
  };

  return (
    <div className={cn(
      "flex-1 p-6 transition-colors relative",
      isDarkTheme ? "bg-gray-900 text-white" : "bg-[#f5f5f7] text-gray-800"
    )}>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">Published Tasks</h1>
        </div>

        <Button 
          className="mb-6 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleCreateTask}
        >
          Create Publish Task
        </Button>

        {tasks.length === 0 ? (
          <div className={cn(
            "rounded-lg shadow-sm border p-8 text-center",
            isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          )}>
            <p className="text-lg mb-4">No published tasks found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click on "Create Publish Task" button to create a new task
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "rounded-lg shadow-sm border overflow-hidden",
                  isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                )}
              >
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">Publish Task {task.id}</h3>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        getBadgeColor(task.type)
                      )}>
                        {task.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Selected Applications</span>
                      <span>{task.selectedApplications}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Publish Scheduler</span>
                      <span>{task.publishScheduler}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Automated Assignment</span>
                      <span>{task.automatedAssignment}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Created Time</span>
                      <span>{task.createdTime}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Required Assignment Groups</span>
                      <span>{task.requiredGroups}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Last Task run time</span>
                      <span>{task.lastRunTime}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Available Assignment Groups</span>
                      <span>{task.availableGroups}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 dark:border-gray-700">
                      <span className="text-gray-500 dark:text-gray-400">Next run time</span>
                      <span>{task.nextRunTime}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-2 border-t dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">Remarks:</span>
                      <span className="text-green-500">{task.remarks}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400">Status:</span>
                      <span className={task.status === "Active" ? "text-green-500" : "text-red-500"}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-750 p-3 flex justify-end gap-2">
                  {task.status === "Active" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      onClick={() => handleViewTask(task.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50 dark:hover:bg-blue-900/40"
                    onClick={() => handleModifyTask(task.id)}
                  >
                    <Pen className="h-4 w-4 mr-1" />
                    Modify
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/50 dark:hover:bg-orange-900/40"
                    onClick={() => handleDisableTask(task.id)}
                  >
                    <PowerOff className="h-4 w-4 mr-1" />
                    {task.status === "Active" ? "Disable" : "Enable"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-900/40"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishedTask;
