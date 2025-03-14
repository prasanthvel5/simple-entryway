
import React from 'react';
import { cn } from "@/lib/utils";
import { Eye, PenLine, Ban, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PublishTask } from "./PublishTaskWizard";

interface PublishedTaskProps {
  isDarkTheme?: boolean;
}

const PublishedTask: React.FC<PublishedTaskProps> = ({ isDarkTheme }) => {
  const navigate = useNavigate();
  const publishTasks: PublishTask[] = JSON.parse(localStorage.getItem('publishTasks') || '[]');

  const handleCreateTask = () => {
    navigate('/dashboard/publish-task-wizard');
  };

  return (
    <div className={cn(
      "flex-1 p-6",
      isDarkTheme ? "bg-gray-900 text-white" : "bg-[#f5f5f7] text-gray-800"
    )}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Published Tasks</h1>
        <Button
          onClick={handleCreateTask}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Create Publish Task
        </Button>
      </div>

      {publishTasks.length === 0 ? (
        <div className={cn(
          "text-center p-8 rounded-lg border",
          isDarkTheme ? "border-gray-700" : "border-gray-200"
        )}>
          <p className="text-lg mb-4">No published tasks found</p>
          <p className="text-gray-500 mb-6">Click the button above to create your first publish task</p>
        </div>
      ) : (
        <div className="space-y-4">
          {publishTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "rounded-lg border p-6",
                isDarkTheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{task.taskName}</h2>
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-sm",
                    task.taskType === "Updates Deployment"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-pink-100 text-pink-800"
                  )}>
                    {task.taskType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-blue-500">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="text-blue-500">
                    <PenLine className="h-4 w-4 mr-1" />
                    Modify
                  </Button>
                  <Button variant="outline" size="sm" className="text-orange-500">
                    <Ban className="h-4 w-4 mr-1" />
                    Disable
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Selected Applications</h3>
                    <p>{task.applications.map(app => app.applicationName).join(', ')} and {Math.max(task.applications.length - 2, 0)} more</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Automated Assignment</h3>
                    <p>{task.deploymentType === "automateAssignment" ? "Enabled" : "Disabled"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Required Assignment Groups</h3>
                    <p>{task.assignmentGroups.filter(g => g.type === "Required").map(g => g.groupName).join(', ') || "None"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Available Assignment Groups</h3>
                    <p>{task.assignmentGroups.filter(g => g.type === "Available").map(g => g.groupName).join(', ') || "None"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Publish Scheduler</h3>
                    <p>Daily at 3.00 PM</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Created Time</h3>
                    <p>{task.createdTime}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Last Task run time</h3>
                    <p>{task.lastRunTime}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Next run time</h3>
                    <p>{task.nextRunTime}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">Remarks:</span>
                  <span className="text-green-500">{task.remarks}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2">Status:</span>
                  <span className="text-green-500">{task.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublishedTask;

