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
          "max-w-3xl w-full h-[700px]",
          "overflow-hidden flex flex-col",
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
              <TabsContent value="appInfo" className="h-[500px] overflow-y-auto p-6">
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

              <TabsContent value="programSettings" className="h-[500px] overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Program Settings</h3>
                    <div className="space-y-4 ml-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Installation Program:</label>
                        <Input 
                          placeholder="setup.exe"
                          className={cn(
                            "w-2/3",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">
                          Installation Switches:
                        </label>
                        <Input 
                          placeholder="/silent"
                          className={cn(
                            "w-2/3",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Uninstall Program:</label>
                        <Input 
                          placeholder="uninstall.exe"
                          className={cn(
                            "w-2/3",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">
                          Uninstall Switches:
                        </label>
                        <Input 
                          placeholder="/silent"
                          className={cn(
                            "w-2/3",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Detection Method:</label>
                        <Select defaultValue="msi">
                          <SelectTrigger 
                            className={cn(
                              "w-2/3",
                              isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                            )}
                          >
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="msi">MSI Product Code</SelectItem>
                            <SelectItem value="registry">Registry Key</SelectItem>
                            <SelectItem value="file">File Detection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Return Codes:</label>
                        <div className={cn(
                          "flex items-center gap-2 w-2/3",
                          isDarkTheme ? "text-gray-300" : "text-gray-600"
                        )}>
                          <span className="text-xs">0: Success</span>
                          <span className="text-xs">1641: Restart initiated</span>
                          <span className="text-xs">3010: Restart required</span>
                          <Button variant="outline" size="xs">Edit Codes</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Device restart behavior:</label>
                        <Select defaultValue="determine">
                          <SelectTrigger 
                            className={cn(
                              "w-2/3",
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
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="postInstall" className="h-[500px] overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Post-Installation Actions</h3>
                    <div className="space-y-4 ml-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Remove Desktop Shortcuts:</label>
                        <div className="flex items-center w-2/3 justify-end">
                          <input 
                            type="checkbox" 
                            id="removeDesktop" 
                            checked={removeDesktopIcon} 
                            onChange={() => setRemoveDesktopIcon(!removeDesktopIcon)}
                            className="mr-2" 
                          />
                          <label htmlFor="removeDesktop">Enable</label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Remove Start Menu Shortcuts:</label>
                        <div className="flex items-center w-2/3 justify-end">
                          <input 
                            type="checkbox" 
                            id="removeStartMenu" 
                            checked={removeStartMenuIcon} 
                            onChange={() => setRemoveStartMenuIcon(!removeStartMenuIcon)}
                            className="mr-2" 
                          />
                          <label htmlFor="removeStartMenu">Enable</label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Disable Automatic Updates:</label>
                        <div className="flex items-center w-2/3 justify-end">
                          <input 
                            type="checkbox" 
                            id="disableUpdates" 
                            checked={disableUpdates} 
                            onChange={() => setDisableUpdates(!disableUpdates)}
                            className="mr-2" 
                          />
                          <label htmlFor="disableUpdates">Enable</label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Default File Associations:</label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={cn(
                            "w-2/3",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        >
                          Configure Associations
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Registry Modifications:</label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={cn(
                            "w-2/3",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        >
                          Configure Registry Keys
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Create Custom Shortcuts:</label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={cn(
                            "w-2/3",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        >
                          Configure Shortcuts
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="scripts" className="h-[500px] overflow-y-auto p-6">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Pre-Installation Script</h3>
                    <div className="space-y-4 ml-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Script File:</label>
                        <div className="flex items-center w-2/3 justify-end">
                          <Select defaultValue="powershell">
                            <SelectTrigger 
                              className={cn(
                                "w-48 mr-2",
                                isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                              )}
                            >
                              <SelectValue placeholder="Script type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="powershell">PowerShell</SelectItem>
                              <SelectItem value="cmd">Command Batch</SelectItem>
                              <SelectItem value="vbs">VBScript</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Upload size={14} className="mr-1" />
                            Browse
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Script Content:</label>
                        <Textarea 
                          className={cn(
                            "w-2/3 h-24 font-mono text-xs",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                          placeholder="# Enter PowerShell script here"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Run Context:</label>
                        <Select defaultValue="system">
                          <SelectTrigger 
                            className={cn(
                              "w-2/3",
                              isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                            )}
                          >
                            <SelectValue placeholder="Select context" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System (SYSTEM)</SelectItem>
                            <SelectItem value="user">Current User</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">
                          Continue on script failure:
                        </label>
                        <div className="flex items-center gap-4 w-2/3 justify-end">
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
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Post-Installation Script</h3>
                    <div className="space-y-4 ml-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Script File:</label>
                        <div className="flex items-center w-2/3 justify-end">
                          <Select defaultValue="powershell">
                            <SelectTrigger 
                              className={cn(
                                "w-48 mr-2",
                                isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                              )}
                            >
                              <SelectValue placeholder="Script type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="powershell">PowerShell</SelectItem>
                              <SelectItem value="cmd">Command Batch</SelectItem>
                              <SelectItem value="vbs">VBScript</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Upload size={14} className="mr-1" />
                            Browse
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Script Content:</label>
                        <Textarea 
                          className={cn(
                            "w-2/3 h-24 font-mono text-xs",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                          placeholder="# Enter PowerShell script here"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">Run Context:</label>
                        <Select defaultValue="system">
                          <SelectTrigger 
                            className={cn(
                              "w-2/3",
                              isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                            )}
                          >
                            <SelectValue placeholder="Select context" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">System (SYSTEM)</SelectItem>
                            <SelectItem value="user">Current User</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium">
                          Continue on script failure:
                        </label>
                        <div className="flex items-center gap-4 w-2/3 justify-end">
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
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="bg-inherit px-6 py-6 border-t mt-auto">
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
