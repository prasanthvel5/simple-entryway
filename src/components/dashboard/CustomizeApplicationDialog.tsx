
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Check } from "lucide-react";

export interface ApplicationCustomizationData {
  applicationName: string;
  version: string;
  description?: string;
  category?: string[];
  publisher?: string;
  informationUrl?: string;
  privacyUrl?: string;
  developer?: string;
  owner?: string;
  notes?: string;
  featured?: boolean;
}

interface CustomizeApplicationDialogProps {
  application: ApplicationCustomizationData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDarkTheme: boolean;
}

export const CustomizeApplicationDialog = ({
  application,
  open,
  onOpenChange,
  isDarkTheme,
}: CustomizeApplicationDialogProps) => {
  const [activeTab, setActiveTab] = useState("appInfo");
  const [isFeatured, setIsFeatured] = useState(application?.featured || false);
  
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "p-0 border rounded-lg",
          "max-w-4xl w-full max-h-[90vh]", 
          "mx-auto",
          isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        )}
      >
        <div className="sticky top-0 z-10 bg-inherit pt-6 px-6 pb-2 border-b">
          <DialogHeader className="mb-0">
            <DialogTitle className="text-xl font-semibold">Customize Application</DialogTitle>
          </DialogHeader>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full mt-4"
          >
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger 
                value="appInfo"
                className={cn(
                  activeTab === "appInfo" && isDarkTheme ? "bg-blue-600 text-white" : "",
                  activeTab === "appInfo" && !isDarkTheme ? "bg-blue-500 text-white" : ""
                )}
              >
                App Information
              </TabsTrigger>
              <TabsTrigger 
                value="programSettings"
                className={cn(
                  activeTab === "programSettings" && isDarkTheme ? "bg-blue-600 text-white" : "",
                  activeTab === "programSettings" && !isDarkTheme ? "bg-blue-500 text-white" : ""
                )}
              >
                Program Settings
              </TabsTrigger>
              <TabsTrigger 
                value="postInstall"
                className={cn(
                  activeTab === "postInstall" && isDarkTheme ? "bg-blue-600 text-white" : "",
                  activeTab === "postInstall" && !isDarkTheme ? "bg-blue-500 text-white" : ""
                )}
              >
                Post Install Settings
              </TabsTrigger>
              <TabsTrigger 
                value="scripts"
                className={cn(
                  activeTab === "scripts" && isDarkTheme ? "bg-blue-600 text-white" : "",
                  activeTab === "scripts" && !isDarkTheme ? "bg-blue-500 text-white" : ""
                )}
              >
                Pre & Post Script
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="appInfo" className="mt-0 p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input 
                      value={application.applicationName} 
                      className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Publisher</label>
                    <Input 
                      value={application.publisher || ""} 
                      placeholder="Google"
                      className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea 
                    value={application.description || ""}
                    placeholder="Google Chrome browser is a free web browser used for accessing the internet and running web-based applications."
                    rows={3}
                    className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {(application.category || ["Productivity", "Browser"]).map((cat, index) => (
                      <div key={index} className={cn(
                        "px-3 py-1 rounded-full text-sm flex items-center gap-1",
                        isDarkTheme ? "bg-gray-700" : "bg-blue-100 text-blue-800"
                      )}>
                        {cat}
                        <button className="ml-1 text-gray-500 hover:text-gray-700">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button className={cn(
                      "px-3 py-1 rounded-full text-sm border",
                      isDarkTheme ? "border-gray-600" : "border-gray-300"
                    )}>
                      + Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Show this as featured app in company portal</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="featuredYes" 
                        checked={isFeatured} 
                        onChange={() => setIsFeatured(true)}
                        className="mr-2" 
                      />
                      <label htmlFor="featuredYes">Yes</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="featuredNo" 
                        checked={!isFeatured} 
                        onChange={() => setIsFeatured(false)}
                        className="mr-2" 
                      />
                      <label htmlFor="featuredNo">No</label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Information URL</label>
                    <Input 
                      value={application.informationUrl || "https://www.google.com/chrome/privacy/"}
                      className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Privacy URL</label>
                    <Input 
                      value={application.privacyUrl || "https://www.google.com/chrome/privacy/"}
                      className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Developer</label>
                    <Input 
                      value={application.developer || ""}
                      className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Owner</label>
                    <Input 
                      value={application.owner || ""}
                      className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea 
                    value={application.notes || ""}
                    rows={2}
                    className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Logo</label>
                  <div className="flex items-center gap-4">
                    <img src="/src/resources/2chrome.png" alt="Logo" className="w-8 h-8" />
                    <Button variant="outline" size="sm">Upload</Button>
                    <Button variant="outline" size="sm" className="text-gray-500">Remove</Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="programSettings" className="mt-0 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Installation Command</label>
                  <Input 
                    placeholder="setup.exe /silent"
                    className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Uninstallation Command</label>
                  <Input 
                    placeholder="uninstall.exe /silent"
                    className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                  />
                </div>
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
              </div>
            </TabsContent>

            <TabsContent value="postInstall" className="mt-0 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Detection Method</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="radio" name="detectionMethod" id="registry" className="mr-2" defaultChecked />
                      <label htmlFor="registry">Registry key exists</label>
                    </div>
                    <div className="flex items-center">
                      <input type="radio" name="detectionMethod" id="file" className="mr-2" />
                      <label htmlFor="file">File exists</label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Registry Path</label>
                  <Input 
                    placeholder="HKLM\\SOFTWARE\\Google\\Chrome"
                    className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scripts" className="mt-0 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Pre-Installation Script</label>
                  <Textarea 
                    placeholder="# Add your PowerShell script here"
                    rows={5}
                    className={cn(
                      "font-mono text-sm",
                      isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Post-Installation Script</label>
                  <Textarea 
                    placeholder="# Add your PowerShell script here"
                    rows={5}
                    className={cn(
                      "font-mono text-sm",
                      isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                    )}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="sticky bottom-0 z-10 bg-inherit px-6 py-4 border-t flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="space-x-2">
            <Button variant="outline">Reset to default</Button>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
