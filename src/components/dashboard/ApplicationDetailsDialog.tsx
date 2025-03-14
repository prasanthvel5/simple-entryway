
import React from "react";
import { Check, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface ApplicationDetailsProps {
  application: ApplicationData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDarkTheme: boolean;
}

export interface ApplicationData {
  applicationName: string;
  vendor: string;
  version: string;
  releaseDate: string;
  category: string;
  inventoryStatus: string;
  publishStatus: string;
  publishTask: string;
  // Extended details for the dialog
  description?: string;
  latestVersion?: string;
  releaseDate2?: string;
  installedMachines?: number;
  licenseType?: string;
  downloadUrl?: string;
  informationUrl?: string;
  knownVulnerabilities?: number;
  recentVulnerabilities?: number;
}

export const ApplicationDetailsDialog = ({ application, open, onOpenChange, isDarkTheme }: ApplicationDetailsProps) => {
  if (!application) return null;

  // Additional details that weren't in the original row data
  const extendedDetails = {
    description: "A more simple, secure, and faster web browser than ever, with Google's smarts built-in.",
    latestVersion: "132.12.14.1",
    releaseDate2: "Dec 16, 2024",
    installedMachines: 546,
    licenseType: "Non-Commercial",
    downloadUrl: "download link",
    informationUrl: "information link",
    knownVulnerabilities: 146,
    recentVulnerabilities: 12
  };

  const mergedData = { ...application, ...extendedDetails };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        variant="bottomSheet"
        className={cn(
          "p-0 overflow-auto border-0 rounded-t-lg rounded-b-none",
          "h-[30vh]", // Increased by 20% from 25vh to 30vh
          "left-0 right-0", // Ensure it takes the full width
          "transform transition-all duration-300 ease-out",
          // Dynamically adjust width based on the second level menu
          document.querySelector('[data-state="open"]') ? "ml-[240px]" : "ml-[72px]" // 72px is the width of the first level menu when second level is collapsed
        )}
        hideCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{mergedData.applicationName} Details</DialogTitle>
          <DialogDescription>
            Detailed information about {mergedData.applicationName} application
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative w-full">
          <div className="p-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <img src="/src/resources/2chrome.png" alt={mergedData.applicationName} className="w-16 h-16" />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold">{mergedData.applicationName}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{mergedData.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Application Information</h3>

                      <div className="grid grid-cols-2 gap-y-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Vendor :</div>
                        <div className="text-sm font-medium flex items-center">
                          {mergedData.vendor}
                          {mergedData.vendor === "Google" && (
                            <Check className="h-4 w-4 text-green-500 ml-2" />
                          )}
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Category :</div>
                        <div className="text-sm font-medium">
                          <div className="flex gap-2">
                            {mergedData.category === "Browser" ? (
                              <>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full text-xs">Productivity</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full text-xs">Browser</span>
                              </>
                            ) : (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded-full text-xs">{mergedData.category}</span>
                            )}
                          </div>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">License type :</div>
                        <div className="text-sm font-medium">{mergedData.licenseType}</div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Download Url :</div>
                        <div className="text-sm font-medium">
                          <a href="#" className="text-blue-500 hover:underline flex items-center">
                            {mergedData.downloadUrl}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Information Url :</div>
                        <div className="text-sm font-medium">
                          <a href="#" className="text-blue-500 hover:underline flex items-center">
                            {mergedData.informationUrl}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Vulnerability Information</h3>
                      
                      <div className="grid grid-cols-2 gap-y-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Latest Version :</div>
                        <div className="text-sm font-medium">{mergedData.latestVersion}</div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Release Date :</div>
                        <div className="text-sm font-medium">{mergedData.releaseDate2}</div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Known Vulnerabilities :</div>
                        <div className="text-sm font-medium">
                          <a href="#" className="text-blue-500 hover:underline">{mergedData.knownVulnerabilities}</a>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Reported in last 30 days :</div>
                        <div className="text-sm font-medium">
                          <a href="#" className="text-blue-500 hover:underline">{mergedData.recentVulnerabilities}</a>
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Inventory Status :</div>
                        <div className="text-sm font-medium">{mergedData.inventoryStatus}</div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Installed Machines :</div>
                        <div className="text-sm font-medium">{mergedData.installedMachines}</div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Publish Status :</div>
                        <div className="text-sm font-medium">
                          {mergedData.publishStatus === 'Updates Published' ? (
                            <span className="text-green-600 dark:text-green-400">Updates Published</span>
                          ) : mergedData.publishStatus === 'Pending' ? (
                            <span className="text-orange-500 dark:text-orange-400">Pending</span>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Not Published</span>
                          )}
                        </div>

                        <div className="text-sm text-gray-500 dark:text-gray-400">Publish Task :</div>
                        <div className="text-sm font-medium">
                          <a href="#" className="text-blue-500 hover:underline">
                            {mergedData.publishTask === 'Chrome publish' ? `${mergedData.publishTask}, Task 2` : mergedData.publishTask}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
