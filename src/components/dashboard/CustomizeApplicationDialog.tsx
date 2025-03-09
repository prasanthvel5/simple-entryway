
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Check, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  
  // Program Settings state
  const [allowUninstall, setAllowUninstall] = useState(true);
  
  // Post Install Settings state
  const [disableUpdates, setDisableUpdates] = useState(true);
  const [removeDesktopIcon, setRemoveDesktopIcon] = useState(true);
  const [removeStartMenuIcon, setRemoveStartMenuIcon] = useState(true);
  
  // Pre & Post Script Settings
  const [proceedPreScript, setProceedPreScript] = useState(true);
  const [proceedPostScript, setProceedPostScript] = useState(true);
  
  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "p-0 border rounded-lg",
          "max-w-3xl w-full h-[650px]", // Fixed height 
          "overflow-hidden flex flex-col", // Use flexbox
          "mx-auto",
          isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        )}
      >
        <div className="bg-inherit pt-6 px-6 pb-2 border-b">
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
                  "border-b-2 rounded-none border-transparent",
                  activeTab === "appInfo" ? "border-blue-500" : "",
                  activeTab === "appInfo" && isDarkTheme ? "text-blue-400" : "",
                  activeTab === "appInfo" && !isDarkTheme ? "text-blue-600" : ""
                )}
              >
                App Information
              </TabsTrigger>
              <TabsTrigger 
                value="programSettings"
                className={cn(
                  "border-b-2 rounded-none border-transparent",
                  activeTab === "programSettings" ? "border-blue-500" : "",
                  activeTab === "programSettings" && isDarkTheme ? "text-blue-400" : "",
                  activeTab === "programSettings" && !isDarkTheme ? "text-blue-600" : ""
                )}
              >
                Program Settings
              </TabsTrigger>
              <TabsTrigger 
                value="postInstall"
                className={cn(
                  "border-b-2 rounded-none border-transparent",
                  activeTab === "postInstall" ? "border-blue-500" : "",
                  activeTab === "postInstall" && isDarkTheme ? "text-blue-400" : "",
                  activeTab === "postInstall" && !isDarkTheme ? "text-blue-600" : ""
                )}
              >
                Post Install Settings
              </TabsTrigger>
              <TabsTrigger 
                value="scripts"
                className={cn(
                  "border-b-2 rounded-none border-transparent",
                  activeTab === "scripts" ? "border-blue-500" : "",
                  activeTab === "scripts" && isDarkTheme ? "text-blue-400" : "",
                  activeTab === "scripts" && !isDarkTheme ? "text-blue-600" : ""
                )}
              >
                Pre & Post Script
              </TabsTrigger>
            </TabsList>
          
            <div className="flex-1 overflow-auto" style={{ height: "calc(100% - 60px)" }}>
              <TabsContent value="appInfo" className="h-[460px] overflow-y-auto p-6">
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

              <TabsContent value="programSettings" className="h-[460px] overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Install Command</label>
                    <Input 
                      placeholder="chrome.exe"
                      className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Uninstall Command</label>
                    <Input 
                      placeholder="unistall.exe /silent"
                      className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Installation time required (mins)</label>
                    <Input 
                      type="number"
                      placeholder="25"
                      className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Allow available uninstall</label>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="allowUninstallYes" 
                          checked={allowUninstall} 
                          onChange={() => setAllowUninstall(true)}
                          className="mr-2" 
                        />
                        <label htmlFor="allowUninstallYes">Yes</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="allowUninstallNo" 
                          checked={!allowUninstall} 
                          onChange={() => setAllowUninstall(false)}
                          className="mr-2" 
                        />
                        <label htmlFor="allowUninstallNo">No</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Device restart behavior</label>
                    <Select defaultValue="determine">
                      <SelectTrigger 
                        className={cn(
                          "w-full",
                          isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                        )}
                      >
                        <SelectValue placeholder="Select behavior" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="determine">Determine behavior based on return codes</SelectItem>
                        <SelectItem value="force">Force restart</SelectItem>
                        <SelectItem value="suppress">Suppress restart</SelectItem>
                        <SelectItem value="basedOnExitCode">Based on exit code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="postInstall" className="h-[460px] overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Disable automatic updates</label>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="disableUpdatesYes" 
                          checked={disableUpdates} 
                          onChange={() => setDisableUpdates(true)}
                          className="mr-2" 
                        />
                        <label htmlFor="disableUpdatesYes">Yes</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="disableUpdatesNo" 
                          checked={!disableUpdates} 
                          onChange={() => setDisableUpdates(false)}
                          className="mr-2" 
                        />
                        <label htmlFor="disableUpdatesNo">No</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Remove desktop shortcut icon</label>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="removeDesktopIconYes" 
                          checked={removeDesktopIcon} 
                          onChange={() => setRemoveDesktopIcon(true)}
                          className="mr-2" 
                        />
                        <label htmlFor="removeDesktopIconYes">Yes</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="removeDesktopIconNo" 
                          checked={!removeDesktopIcon} 
                          onChange={() => setRemoveDesktopIcon(false)}
                          className="mr-2" 
                        />
                        <label htmlFor="removeDesktopIconNo">No</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Remove startmenu shortcut icon</label>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="removeStartMenuIconYes" 
                          checked={removeStartMenuIcon} 
                          onChange={() => setRemoveStartMenuIcon(true)}
                          className="mr-2" 
                        />
                        <label htmlFor="removeStartMenuIconYes">Yes</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="removeStartMenuIconNo" 
                          checked={!removeStartMenuIcon} 
                          onChange={() => setRemoveStartMenuIcon(false)}
                          className="mr-2" 
                        />
                        <label htmlFor="removeStartMenuIconNo">No</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 mr-4">
                      Apply to all selected Applications
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="scripts" className="h-[460px] overflow-y-auto p-6">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Pre Script Settings</h3>
                    <div className="space-y-4 ml-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Select Script :</label>
                        <div className="flex items-center">
                          <div className="border rounded px-3 py-1.5 mr-2 bg-white text-black">
                            command.bat
                          </div>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Upload size={14} className="mr-1" />
                            Click to Upload
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">
                          Proceed installation irrespective of script status :
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="proceedPreScriptYes" 
                              checked={proceedPreScript} 
                              onChange={() => setProceedPreScript(true)}
                              className="mr-2" 
                            />
                            <label htmlFor="proceedPreScriptYes">Yes</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="proceedPreScriptNo" 
                              checked={!proceedPreScript} 
                              onChange={() => setProceedPreScript(false)}
                              className="mr-2" 
                            />
                            <label htmlFor="proceedPreScriptNo">No</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Specify success return code:</label>
                        <Input 
                          type="number"
                          defaultValue="0"
                          className="w-24 text-center"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Post Script Settings</h3>
                    <div className="space-y-4 ml-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Select Script :</label>
                        <div className="flex items-center">
                          <div className="border rounded px-3 py-1.5 mr-2 bg-white text-black">
                            command.bat
                          </div>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Upload size={14} className="mr-1" />
                            Click to Upload
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">
                          Proceed installation irrespective of script status :
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="proceedPostScriptYes" 
                              checked={proceedPostScript} 
                              onChange={() => setProceedPostScript(true)}
                              className="mr-2" 
                            />
                            <label htmlFor="proceedPostScriptYes">Yes</label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              id="proceedPostScriptNo" 
                              checked={!proceedPostScript} 
                              onChange={() => setProceedPostScript(false)}
                              className="mr-2" 
                            />
                            <label htmlFor="proceedPostScriptNo">No</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Specify success return code:</label>
                        <Input 
                          type="number"
                          defaultValue="0"
                          className="w-24 text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="bg-inherit px-6 py-4 border-t mt-auto">
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
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
