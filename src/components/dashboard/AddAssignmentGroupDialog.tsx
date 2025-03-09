import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AddAssignmentGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDarkTheme: boolean;
  onSave: (groupData: AssignmentGroupData) => void;
}

export interface AssignmentGroupData {
  groupName: string;
  groupMode: "Included" | "Excluded";
  filterMode: string;
  filterName: string;
  endUserNotification: string;
  deliveryOptimization: string;
  timeZone: "UTC" | "Device Time Zone";
  appAvailability: "As soon as possible" | "Delay in days" | "A specific date and time";
  appInstallationDeadline: "As soon as possible" | "Delay in days" | "A specific date and time";
  restartGracePeriod: "Enabled" | "Disabled";
}

export const AddAssignmentGroupDialog: React.FC<AddAssignmentGroupDialogProps> = ({
  open,
  onOpenChange,
  isDarkTheme,
  onSave
}) => {
  const [groupData, setGroupData] = React.useState<AssignmentGroupData>({
    groupName: "Test Group",
    groupMode: "Included",
    filterMode: "Include filtered devices in assignment",
    filterName: "Windows 10",
    endUserNotification: "Show all toast notifications",
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

  const handleChange = (field: keyof AssignmentGroupData, value: string) => {
    setGroupData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-2xl max-h-[90vh] overflow-y-auto p-6 grid grid-rows-[auto_1fr_auto]",
        isDarkTheme ? "bg-gray-800 text-white" : "bg-white"
      )}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-500">Add Assignment Group</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onOpenChange(false)}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6 overflow-y-auto pr-2">
          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="groupName" className="text-right font-medium">Group Name</Label>
            <Select value={groupData.groupName} onValueChange={(value) => handleChange("groupName", value)}>
              <SelectTrigger id="groupName">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
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
                <RadioGroupItem value="Included" id="included" />
                <Label htmlFor="included">Included</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Excluded" id="excluded" />
                <Label htmlFor="excluded">Excluded</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="filterMode" className="text-right font-medium">Filter Mode</Label>
            <Select value={groupData.filterMode} onValueChange={(value) => handleChange("filterMode", value)}>
              <SelectTrigger id="filterMode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Include filtered devices in assignment">Include filtered devices in assignment</SelectItem>
                <SelectItem value="Exclude filtered devices from assignment">Exclude filtered devices from assignment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="filterName" className="text-right font-medium">Filter Name</Label>
            <Select value={groupData.filterName} onValueChange={(value) => handleChange("filterName", value)}>
              <SelectTrigger id="filterName">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Windows 10">Windows 10</SelectItem>
                <SelectItem value="Windows 11">Windows 11</SelectItem>
                <SelectItem value="macOS">macOS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="endUserNotification" className="text-right font-medium">End User Notification</Label>
            <Select value={groupData.endUserNotification} onValueChange={(value) => handleChange("endUserNotification", value)}>
              <SelectTrigger id="endUserNotification">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Show all toast notifications">Show all toast notifications</SelectItem>
                <SelectItem value="Show only critical notifications">Show only critical notifications</SelectItem>
                <SelectItem value="Hide all notifications">Hide all notifications</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[180px_1fr] items-center gap-4">
            <Label htmlFor="deliveryOptimization" className="text-right font-medium">Delivery optimization priority</Label>
            <Select value={groupData.deliveryOptimization} onValueChange={(value) => handleChange("deliveryOptimization", value)}>
              <SelectTrigger id="deliveryOptimization">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
                <RadioGroupItem value="UTC" id="utc" />
                <Label htmlFor="utc">UTC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Device Time Zone" id="deviceTimeZone" />
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
                <RadioGroupItem value="As soon as possible" id="appAvailAsap" />
                <Label htmlFor="appAvailAsap">As soon as possible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Delay in days" id="appAvailDelay" />
                <Label htmlFor="appAvailDelay">Delay in days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="A specific date and time" id="appAvailSpecific" />
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
                <RadioGroupItem value="As soon as possible" id="appInstallAsap" />
                <Label htmlFor="appInstallAsap">As soon as possible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Delay in days" id="appInstallDelay" />
                <Label htmlFor="appInstallDelay">Delay in days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="A specific date and time" id="appInstallSpecific" />
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
                <RadioGroupItem value="Enabled" id="restartEnabled" />
                <Label htmlFor="restartEnabled">Enabled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Disabled" id="restartDisabled" />
                <Label htmlFor="restartDisabled">Disabled</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className={isDarkTheme ? "bg-gray-700 border-gray-600 text-white hover:text-white hover:bg-gray-600" : ""}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
