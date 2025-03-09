
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X, Check, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
          "w-full max-w-[90vw] md:max-w-3xl h-[90vh] md:h-[700px]",
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <RadioGroup 
                      defaultValue={isFeatured ? "yes" : "no"} 
                      onValueChange={(val) => setIsFeatured(val === "yes")}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="yes" 
                          id="featuredYes" 
                          className={cn(
                            "text-blue-500 border-blue-500",
                            "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                          )}
                        />
                        <Label htmlFor="featuredYes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value="no" 
                          id="featuredNo"
                          className={cn(
                            "text-blue-500 border-blue-500",
                            "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                          )}
                        />
                        <Label htmlFor="featuredNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium md:w-1/3">Installation Program:</label>
                        <Input 
                          placeholder="setup.exe"
                          className={cn(
                            "w-full md:w-2/3 mt-1 md:mt-0",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium md:w-1/3">
                          Installation Switches:
                        </label>
                        <Input 
                          placeholder="/silent"
                          className={cn(
                            "w-full md:w-2/3 mt-1 md:mt-0",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium md:w-1/3">Uninstall Program:</label>
                        <Input 
                          placeholder="uninstall.exe"
                          className={cn(
                            "w-full md:w-2/3 mt-1 md:mt-0",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium md:w-1/3">
                          Uninstall Switches:
                        </label>
                        <Input 
                          placeholder="/silent"
                          className={cn(
                            "w-full md:w-2/3 mt-1 md:mt-0",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium md:w-1/3">Detection Method:</label>
                        <div className="w-full md:w-2/3 mt-1 md:mt-0">
                          <Select defaultValue="msi">
                            <SelectTrigger 
                              className={cn(
                                "w-full",
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
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium md:w-1/3">Return Codes:</label>
                        <div className={cn(
                          "flex flex-wrap items-center gap-2 w-full md:w-2/3 mt-1 md:mt-0",
                          isDarkTheme ? "text-gray-300" : "text-gray-600"
                        )}>
                          <span className="text-xs">0: Success</span>
                          <span className="text-xs">1641: Restart initiated</span>
                          <span className="text-xs">3010: Restart required</span>
                          <Button variant="outline" size="xs">Edit Codes</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium md:w-1/3">Device restart behavior:</label>
                        <div className="w-full md:w-2/3 mt-1 md:mt-0">
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
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="postInstall" className="h-[500px] overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Post-Installation Actions</h3>
                    <div className="space-y-4 ml-2">
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-center">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/2">Remove Desktop Shortcuts:</label>
                        <div className="flex items-center justify-end w-full md:w-1/2">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="removeDesktop" 
                              checked={removeDesktopIcon} 
                              onChange={() => setRemoveDesktopIcon(!removeDesktopIcon)}
                              className={cn(
                                "rounded border text-blue-500 focus:ring-blue-500",
                                isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                              )}
                            />
                            <label htmlFor="removeDesktop">Enable</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-center">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/2">Remove Start Menu Shortcuts:</label>
                        <div className="flex items-center justify-end w-full md:w-1/2">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="removeStartMenu" 
                              checked={removeStartMenuIcon} 
                              onChange={() => setRemoveStartMenuIcon(!removeStartMenuIcon)}
                              className={cn(
                                "rounded border text-blue-500 focus:ring-blue-500",
                                isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                              )}
                            />
                            <label htmlFor="removeStartMenu">Enable</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-center">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/2">Disable Automatic Updates:</label>
                        <div className="flex items-center justify-end w-full md:w-1/2">
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              id="disableUpdates" 
                              checked={disableUpdates} 
                              onChange={() => setDisableUpdates(!disableUpdates)}
                              className={cn(
                                "rounded border text-blue-500 focus:ring-blue-500",
                                isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                              )}
                            />
                            <label htmlFor="disableUpdates">Enable</label>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between flex-col md:flex-row md:items-center">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/2">Default File Associations:</label>
                        <div className="w-full md:w-1/2 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn(
                              "w-full md:w-auto",
                              isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                            )}
                          >
                            Configure Associations
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-center">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/2">Registry Modifications:</label>
                        <div className="w-full md:w-1/2 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn(
                              "w-full md:w-auto",
                              isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                            )}
                          >
                            Configure Registry Keys
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-center">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/2">Create Custom Shortcuts:</label>
                        <div className="w-full md:w-1/2 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn(
                              "w-full md:w-auto",
                              isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                            )}
                          >
                            Configure Shortcuts
                          </Button>
                        </div>
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
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/3">Script File:</label>
                        <div className="flex items-center w-full md:w-2/3 justify-end flex-col md:flex-row gap-2">
                          <Select defaultValue="powershell">
                            <SelectTrigger 
                              className={cn(
                                "w-full md:w-48",
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
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/3">Script Content:</label>
                        <Textarea 
                          className={cn(
                            "w-full md:w-2/3 h-24 font-mono text-xs",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                          placeholder="# Enter PowerShell script here"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/3">Run Context:</label>
                        <div className="w-full md:w-2/3">
                          <Select defaultValue="system">
                            <SelectTrigger 
                              className={cn(
                                "w-full",
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
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-center">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/3">
                          Continue on script failure:
                        </label>
                        <div className="flex items-center w-full md:w-2/3 md:justify-start">
                          <RadioGroup 
                            defaultValue={proceedPreScript ? "yes" : "no"} 
                            onValueChange={(val) => setProceedPreScript(val === "yes")}
                            className="flex items-center gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="yes" 
                                id="proceedPreScriptYes" 
                                className={cn(
                                  "text-blue-500 border-blue-500",
                                  "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                                )}
                              />
                              <Label htmlFor="proceedPreScriptYes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="no" 
                                id="proceedPreScriptNo"
                                className={cn(
                                  "text-blue-500 border-blue-500",
                                  "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                                )}
                              />
                              <Label htmlFor="proceedPreScriptNo">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Post-Installation Script</h3>
                    <div className="space-y-4 ml-2">
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/3">Script File:</label>
                        <div className="flex items-center w-full md:w-2/3 justify-end flex-col md:flex-row gap-2">
                          <Select defaultValue="powershell">
                            <SelectTrigger 
                              className={cn(
                                "w-full md:w-48",
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
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/3">Script Content:</label>
                        <Textarea 
                          className={cn(
                            "w-full md:w-2/3 h-24 font-mono text-xs",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}
                          placeholder="# Enter PowerShell script here"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-start">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/3">Run Context:</label>
                        <div className="w-full md:w-2/3">
                          <Select defaultValue="system">
                            <SelectTrigger 
                              className={cn(
                                "w-full",
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
                      </div>
                      
                      <div className="flex items-center justify-between flex-col md:flex-row md:items-center">
                        <label className="block text-sm font-medium mb-1 md:mb-0 md:w-1/3">
                          Continue on script failure:
                        </label>
                        <div className="flex items-center w-full md:w-2/3 md:justify-start">
                          <RadioGroup 
                            defaultValue={proceedPostScript ? "yes" : "no"} 
                            onValueChange={(val) => setProceedPostScript(val === "yes")}
                            className="flex items-center gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="yes" 
                                id="proceedPostScriptYes" 
                                className={cn(
                                  "text-blue-500 border-blue-500",
                                  "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                                )}
                              />
                              <Label htmlFor="proceedPostScriptYes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value="no" 
                                id="proceedPostScriptNo"
                                className={cn(
                                  "text-blue-500 border-blue-500",
                                  "data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                                )}
                              />
                              <Label htmlFor="proceedPostScriptNo">No</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="bg-inherit px-6 py-4 border-t mt-auto sticky bottom-0 z-10 shadow-md">
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className={cn(
                "min-w-[100px]",
                isDarkTheme ? "hover:bg-gray-700" : "hover:bg-gray-100"
              )}
            >
              Cancel
            </Button>
            <Button 
              variant="outline"
              className={cn(
                "min-w-[100px]",
                isDarkTheme ? "hover:bg-gray-700" : "hover:bg-gray-100"
              )}
            >
              Reset to default
            </Button>
            <Button 
              className={cn(
                "bg-blue-500 hover:bg-blue-600 min-w-[100px]",
                "text-white font-medium"
              )}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
