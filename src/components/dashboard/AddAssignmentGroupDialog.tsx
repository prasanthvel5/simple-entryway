import React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Pencil, X } from "lucide-react";

interface AddAssignmentGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDarkTheme: boolean;
  onSave: (groupData: AssignmentGroupData) => void;
}

interface Language {
  code: string;
  name: string;
  enabled: boolean;
}

export interface AssignmentGroupData {
  scopeTags: string[];
  groupName: string;
  groupMode: "Included" | "Excluded";
  filterMode: string;
  filterName: string;
  endUserNotification: string;
  notificationCustomization?: {
    postponeAttempts?: number;
    postponeDuration?: number;
    allowUserDecide?: boolean;
    languages?: Language[];
  };
  deliveryOptimization: string;
  timeZone: "UTC" | "Device Time Zone";
  appAvailability: "As soon as possible" | "Delay in days" | "A specific date and time";
  appInstallationDeadline: "As soon as possible" | "Delay in days" | "A specific date and time";
  restartGracePeriod: "Enabled" | "Disabled";
}

const defaultLanguages: Language[] = [
  { code: "en", name: "English", enabled: true },
  { code: "fr", name: "French", enabled: true },
  { code: "de", name: "German", enabled: false },
  { code: "es", name: "Spanish", enabled: false },
  { code: "zh", name: "Chinese", enabled: false },
  { code: "ar", name: "Arabic", enabled: false },
];

const availableScopeTags = [
  "Development",
  "Production",
  "Testing",
  "Staging",
  "QA",
  "UAT",
  "Beta",
  "Alpha",
];

export const AddAssignmentGroupDialog = ({
  open,
  onOpenChange,
  isDarkTheme,
  onSave
}: AddAssignmentGroupDialogProps) => {
  const [groupData, setGroupData] = React.useState<AssignmentGroupData>({
    scopeTags: [],
    groupName: "Test Group",
    groupMode: "Included",
    filterMode: "Include filtered devices in assignment",
    filterName: "Windows 10",
    endUserNotification: "Show all toast notifications",
    notificationCustomization: {
      postponeAttempts: 3,
      postponeDuration: 24,
      allowUserDecide: false,
      languages: defaultLanguages
    },
    deliveryOptimization: "Content download in background",
    timeZone: "UTC",
    appAvailability: "As soon as possible",
    appInstallationDeadline: "As soon as possible",
    restartGracePeriod: "Disabled"
  });

  const handleSave = () => {
    onSave(groupData);
    onOpenChange(false);
  };

  const handleChange = (field: keyof AssignmentGroupData, value: string | boolean | object | string[]) => {
    setGroupData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationCustomizationChange = (field: keyof NonNullable<AssignmentGroupData['notificationCustomization']>, value: number | boolean | Language[]) => {
    setGroupData(prev => ({
      ...prev,
      notificationCustomization: {
        ...prev.notificationCustomization,
        [field]: value
      }
    }));
  };

  const toggleLanguage = (languageCode: string) => {
    const updatedLanguages = groupData.notificationCustomization?.languages?.map(lang => 
      lang.code === languageCode ? { ...lang, enabled: !lang.enabled } : lang
    ) || [];
    
    handleNotificationCustomizationChange('languages', updatedLanguages);
  };

  const handleScopeTagSelect = (tag: string) => {
    if (groupData.scopeTags.includes(tag)) {
      handleChange('scopeTags', groupData.scopeTags.filter(t => t !== tag));
    } else {
      handleChange('scopeTags', [...groupData.scopeTags, tag]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-2xl max-h-[90vh] overflow-y-auto p-6",
        isDarkTheme ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-200"
      )}>
        <DialogTitle className="text-xl font-semibold text-blue-500 mb-6">Add Assignment Group</DialogTitle>
        
        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="grid grid-cols-[180px_1fr] items-start gap-4">
            <Label className="text-right font-medium pt-2">Scope Tags</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {groupData.scopeTags.map((tag) => (
                  <div
                    key={tag}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm flex items-center gap-1",
                      isDarkTheme ? "bg-gray-700 text-white" : "bg-blue-100 text-blue-800"
                    )}
                  >
                    {tag}
                    <button
                      onClick={() => handleScopeTagSelect(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <Select
                onValueChange={handleScopeTagSelect}
                value={undefined}
              >
                <SelectTrigger className={cn(
                  isDarkTheme ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
                )}>
                  <SelectValue placeholder="Select scope tags..." />
                </SelectTrigger>
                <SelectContent>
                  {availableScopeTags
                    .filter(tag => !groupData.scopeTags.includes(tag))
                    .map(tag => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="groupName" className="text-right font-medium">Group Name</Label>
            <Select value={groupData.groupName} onValueChange={(value) => handleChange("groupName", value)}>
              <SelectTrigger id="groupName" className={cn(
                isDarkTheme ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
              )}>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent className={isDarkTheme ? "bg-gray-800 border-gray-700" : ""}>
                <SelectItem value="Test Group">Test Group</SelectItem>
                <SelectItem value="Marketing Department">Marketing Department</SelectItem>
                <SelectItem value="Sales Team">Sales Team</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label className="text-right font-medium">Group Mode</Label>
            <RadioGroup 
              value={groupData.groupMode} 
              onValueChange={(value) => handleChange("groupMode", value as "Included" | "Excluded")}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Included" id="included" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="included">Included</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Excluded" id="excluded" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="excluded">Excluded</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="filterMode" className="text-right font-medium">Filter Mode</Label>
            <Select value={groupData.filterMode} onValueChange={(value) => handleChange("filterMode", value)}>
              <SelectTrigger id="filterMode" className={cn(
                isDarkTheme ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
              )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDarkTheme ? "bg-gray-800 border-gray-700" : ""}>
                <SelectItem value="Include filtered devices in assignment">Include filtered devices in assignment</SelectItem>
                <SelectItem value="Exclude filtered devices from assignment">Exclude filtered devices from assignment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="filterName" className="text-right font-medium">Filter Name</Label>
            <Select value={groupData.filterName} onValueChange={(value) => handleChange("filterName", value)}>
              <SelectTrigger id="filterName" className={cn(
                isDarkTheme ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
              )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDarkTheme ? "bg-gray-800 border-gray-700" : ""}>
                <SelectItem value="Windows 10">Windows 10</SelectItem>
                <SelectItem value="Windows 11">Windows 11</SelectItem>
                <SelectItem value="macOS">macOS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-[180px_1fr] items-center gap-4">
              <Label htmlFor="endUserNotification" className="text-right font-medium">End User Notification</Label>
              <Select value={groupData.endUserNotification} onValueChange={(value) => handleChange("endUserNotification", value)}>
                <SelectTrigger id="endUserNotification" className={cn(
                  isDarkTheme ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
                )}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={isDarkTheme ? "bg-gray-800 border-gray-700" : ""}>
                  <SelectItem value="Show all toast notifications">Show all toast notifications</SelectItem>
                  <SelectItem value="Show only critical notifications">Show only critical notifications</SelectItem>
                  <SelectItem value="Hide all notifications">Hide all notifications</SelectItem>
                  <SelectItem value="Allow user to decide">Allow user to decide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {groupData.endUserNotification === "Allow user to decide" && (
              <div className="grid grid-cols-[180px_1fr] items-start gap-4">
                <div className="text-right font-medium">
                  <Label className="text-sm">Notification Settings</Label>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="postponeAttempts" className="min-w-[140px]">Postpone Attempts:</Label>
                      <Select 
                        value={groupData.notificationCustomization?.postponeAttempts?.toString()} 
                        onValueChange={(value) => handleNotificationCustomizationChange("postponeAttempts", parseInt(value))}
                      >
                        <SelectTrigger id="postponeAttempts" className={cn(
                          "w-24",
                          isDarkTheme ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
                        )}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-4">
                      <Label htmlFor="postponeDuration" className="min-w-[140px]">Postpone Duration:</Label>
                      <Select 
                        value={groupData.notificationCustomization?.postponeDuration?.toString()}
                        onValueChange={(value) => handleNotificationCustomizationChange("postponeDuration", parseInt(value))}
                      >
                        <SelectTrigger id="postponeDuration" className={cn(
                          "w-24",
                          isDarkTheme ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
                        )}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[12, 24, 48, 72].map(hours => (
                            <SelectItem key={hours} value={hours.toString()}>{hours}h</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">Languages</Label>
                    <div className={cn(
                      "rounded-lg border",
                      isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
                    )}>
                      {groupData.notificationCustomization?.languages?.map((language, index) => (
                        <div
                          key={language.code}
                          className={cn(
                            "flex items-center justify-between px-4 py-2",
                            index !== 0 && "border-t",
                            isDarkTheme ? "border-gray-600" : "border-gray-200"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm">{language.name}</span>
                            {language.code === "en" && (
                              <Pencil className="h-3.5 w-3.5 text-blue-500" />
                            )}
                          </div>
                          <div 
                            className="cursor-pointer"
                            onClick={() => toggleLanguage(language.code)}
                          >
                            {language.enabled && (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="deliveryOptimization" className="text-right font-medium">Delivery optimization priority</Label>
            <Select value={groupData.deliveryOptimization} onValueChange={(value) => handleChange("deliveryOptimization", value)}>
              <SelectTrigger id="deliveryOptimization" className={cn(
                isDarkTheme ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200"
              )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={isDarkTheme ? "bg-gray-800 border-gray-700" : ""}>
                <SelectItem value="Content download in background">Content download in background</SelectItem>
                <SelectItem value="Download in foreground">Download in foreground</SelectItem>
                <SelectItem value="Optimized for network performance">Optimized for network performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label className="text-right font-medium">Time Zone</Label>
            <RadioGroup 
              value={groupData.timeZone} 
              onValueChange={(value) => handleChange("timeZone", value as "UTC" | "Device Time Zone")}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="UTC" id="utc" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="utc">UTC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Device Time Zone" id="deviceTimeZone" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="deviceTimeZone">Device Time Zone</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label className="text-right font-medium">App availability</Label>
            <RadioGroup 
              value={groupData.appAvailability} 
              onValueChange={(value) => handleChange("appAvailability", value as "As soon as possible" | "Delay in days" | "A specific date and time")}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="As soon as possible" id="appAvailAsap" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="appAvailAsap">As soon as possible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Delay in days" id="appAvailDelay" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="appAvailDelay">Delay in days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="A specific date and time" id="appAvailSpecific" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="appAvailSpecific">A specific date and time</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label className="text-right font-medium">App Installation deadline</Label>
            <RadioGroup 
              value={groupData.appInstallationDeadline} 
              onValueChange={(value) => handleChange("appInstallationDeadline", value as "As soon as possible" | "Delay in days" | "A specific date and time")}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="As soon as possible" id="appInstallAsap" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="appInstallAsap">As soon as possible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Delay in days" id="appInstallDelay" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="appInstallDelay">Delay in days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="A specific date and time" id="appInstallSpecific" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="appInstallSpecific">A specific date and time</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label className="text-right font-medium">Restart Grace Period</Label>
            <RadioGroup 
              value={groupData.restartGracePeriod} 
              onValueChange={(value) => handleChange("restartGracePeriod", value as "Enabled" | "Disabled")}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Enabled" id="restartEnabled" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="restartEnabled">Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disabled" id="restartDisabled" className={isDarkTheme ? "border-gray-400" : ""} />
                <Label htmlFor="restartDisabled">Disabled</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className={cn(
              "min-w-[100px]",
              isDarkTheme ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600" : ""
            )}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className={cn(
              "min-w-[100px] bg-blue-500 hover:bg-blue-600 text-white"
            )}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};