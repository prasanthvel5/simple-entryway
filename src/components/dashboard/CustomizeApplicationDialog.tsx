import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [formData, setFormData] = useState<ApplicationCustomizationData>({
    applicationName: "",
    version: "",
    description: "",
    category: [],
    publisher: "",
    informationUrl: "",
    privacyUrl: "",
    developer: "",
    owner: "",
    notes: "",
    featured: false
  });

  const [disableAutomaticUpdates, setDisableAutomaticUpdates] = useState("yes");
  const [removeDesktopShortcut, setRemoveDesktopShortcut] = useState("yes");
  const [removeStartMenuShortcut, setRemoveStartMenuShortcut] = useState("yes");
  const [removeStartMenuShortcut2, setRemoveStartMenuShortcut2] = useState("yes");

  useEffect(() => {
    if (application) {
      setFormData(application);
    }
  }, [application]);

  const handleInputChange = (field: keyof ApplicationCustomizationData, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRemoveCategory = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category?.filter((_, index) => index !== indexToRemove) || []
    }));
  };

  const handleAddCategory = () => {
    const newCategory = "New Category";
    setFormData(prev => ({
      ...prev,
      category: [...(prev.category || []), newCategory]
    }));
  };

  const handleSave = () => {
    console.log("Saving changes:", formData);
    onOpenChange(false);
  };

  const handleResetToDefault = () => {
    if (application) {
      setFormData(application);
    }
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "p-0 border rounded-lg",
        "w-full max-w-[90vw] md:max-w-3xl h-[90vh] md:h-[700px]",
        "overflow-hidden flex flex-col",
        "mx-auto",
        isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      )}>
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
                        value={formData.applicationName} 
                        onChange={(e) => handleInputChange("applicationName", e.target.value)}
                        className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Publisher</label>
                      <Input 
                        value={formData.publisher || ""} 
                        onChange={(e) => handleInputChange("publisher", e.target.value)}
                        placeholder="Google"
                        className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea 
                      value={formData.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Google Chrome browser is a free web browser used for accessing the internet and running web-based applications."
                      rows={3}
                      className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.category?.map((cat, index) => (
                        <div key={index} className={cn(
                          "px-3 py-1 rounded-full text-sm flex items-center gap-1",
                          isDarkTheme ? "bg-gray-700" : "bg-blue-100 text-blue-800"
                        )}>
                          {cat}
                          <button 
                            onClick={() => handleRemoveCategory(index)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button className={cn(
                        "px-3 py-1 rounded-full text-sm border",
                        isDarkTheme ? "border-gray-600" : "border-gray-300"
                      )} onClick={handleAddCategory}>
                        + Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Show this as featured app in company portal</label>
                    <RadioGroup 
                      value={formData.featured ? "yes" : "no"} 
                      onValueChange={(val) => handleInputChange("featured", val === "yes")}
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
                        value={formData.informationUrl || ""}
                        onChange={(e) => handleInputChange("informationUrl", e.target.value)}
                        className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Privacy URL</label>
                      <Input 
                        value={formData.privacyUrl || ""}
                        onChange={(e) => handleInputChange("privacyUrl", e.target.value)}
                        className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Developer</label>
                      <Input 
                        value={formData.developer || ""}
                        onChange={(e) => handleInputChange("developer", e.target.value)}
                        className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Owner</label>
                      <Input 
                        value={formData.owner || ""}
                        onChange={(e) => handleInputChange("owner", e.target.value)}
                        className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Notes</label>
                    <Textarea 
                      value={formData.notes || ""}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
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
              </TabsContent>

              <TabsContent value="postInstall" className="h-[500px] overflow-y-auto p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">Disable automatic updates</label>
                    <RadioGroup 
                      value={disableAutomaticUpdates}
                      onValueChange={setDisableAutomaticUpdates}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="disableUpdatesYes" />
                        <Label htmlFor="disableUpdatesYes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="disableUpdatesNo" />
                        <Label htmlFor="disableUpdatesNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">Remove desktop shortcut icon</label>
                    <RadioGroup 
                      value={removeDesktopShortcut}
                      onValueChange={setRemoveDesktopShortcut}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="removeDesktopYes" />
                        <Label htmlFor="removeDesktopYes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="removeDesktopNo" />
                        <Label htmlFor="removeDesktopNo">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">Remove startmenu shortcut icon</label>
                    <RadioGroup 
                      value={removeStartMenuShortcut}
                      onValueChange={setRemoveStartMenuShortcut}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="removeStartMenu1Yes" />
                        <Label htmlFor="removeStartMenu1Yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="removeStartMenu1No" />
                        <Label htmlFor="removeStartMenu1No">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">Remove startmenu shortcut icon</label>
                    <RadioGroup 
                      value={removeStartMenuShortcut2}
                      onValueChange={setRemoveStartMenuShortcut2}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="removeStartMenu2Yes" />
                        <Label htmlFor="removeStartMenu2Yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="removeStartMenu2No" />
                        <Label htmlFor="removeStartMenu2No">No</Label>
                      </div>
                    </RadioGroup>
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
                            defaultValue="yes"
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
                            defaultValue="yes"
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
      </DialogContent>
    </Dialog>
  );
};