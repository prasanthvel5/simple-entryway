
import React, { useState, useEffect } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Plus, 
  Search, 
  Settings, 
  X, 
  Upload 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CustomizeApplicationDialog, ApplicationCustomizationData } from "@/components/dashboard/CustomizeApplicationDialog";
import { AddAssignmentGroupDialog, AssignmentGroupData } from "@/components/dashboard/AddAssignmentGroupDialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

type WizardStep = "selectApplications" | "assignmentSettings" | "installationSettings" | "publishSettings" | "review";

interface Application {
  applicationName: string;
  vendor: string;
  version: string;
  releaseDate: string;
  category: string;
  inventoryStatus: string;
  publishStatus: string;
  publishTask: string;
  description?: string;
  publisher?: string;
  informationUrl?: string;
  privacyUrl?: string;
  developer?: string;
  owner?: string;
  notes?: string;
  featured?: boolean;
}

interface AssignmentGroup {
  id: string;
  type: "Required" | "Available";
  groupName: string;
  groupMode: string;
  filterMode: string;
  filterName: string;
  appAvailability: string;
  installationDeadline: string;
  restartGracePeriod: string;
}

interface NotificationCustomization {
  language: string;
  title: string;
  message: string;
}

export interface PublishTask {
  id: string;
  taskName: string;
  taskType: string;
  applications: Application[];
  deploymentType: "publishOnly" | "automateAssignment";
  assignmentGroups: AssignmentGroup[];
  installationBehavior: string;
  postponeAttempts?: string;
  postponeNotificationTime?: string;
  noResponseAction?: string;
  notificationCustomizations: Record<string, NotificationCustomization>;
  organizationLogo?: string;
  publishSchedule: "immediate" | "scheduled";
  selectedDate?: string;
  showEndUserNotifications: boolean;
  useCustomMessage: boolean;
  customMessage?: string;
  createdTime: string;
  lastRunTime: string;
  nextRunTime: string;
  status: "Active" | "Disabled" | "Completed";
  remarks: string;
}

type DashboardContext = {
  isDarkTheme: boolean;
  activeMenu: string;
  activeSecondLevel: string;
};

const PublishTaskWizard = () => {
  const { isDarkTheme } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentStep, setCurrentStep] = useState<WizardStep>("selectApplications");
  const [applications, setApplications] = useState<Application[]>([]);
  const [taskName, setTaskName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [deploymentType, setDeploymentType] = useState<"publishOnly" | "automateAssignment">("publishOnly");
  const [showAddApplicationsDialog, setShowAddApplicationsDialog] = useState(false);
  const [customizeApp, setCustomizeApp] = useState<ApplicationCustomizationData | null>(null);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [showAddAssignmentDialog, setShowAddAssignmentDialog] = useState(false);
  const [currentAssignmentType, setCurrentAssignmentType] = useState<"Required" | "Available">("Required");
  const [assignmentGroups, setAssignmentGroups] = useState<AssignmentGroup[]>([]);

  const [autoPublishNewVersions, setAutoPublishNewVersions] = useState<boolean>(false);
  const [publishScheduleOption, setPublishScheduleOption] = useState<"wheneverReleased" | "schedule">("wheneverReleased");
  const [frequency, setFrequency] = useState<"hourly" | "daily" | "weekly">("daily");
  const [startTime, setStartTime] = useState<string>("17:23");
  const [addNewlyInstalled, setAddNewlyInstalled] = useState<boolean>(false);
  const [cleanupDays, setCleanupDays] = useState<string>("60");

  const [installationBehavior, setInstallationBehavior] = useState("skipIfRunning");
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [postponeAttempts, setPostponeAttempts] = useState("5");
  const [postponeNotificationTime, setPostponeNotificationTime] = useState("10");
  const [noResponseAction, setNoResponseAction] = useState("forceClose");

  const [organizationLogo, setOrganizationLogo] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [notificationCustomizations, setNotificationCustomizations] = useState<Record<string, NotificationCustomization>>({
    English: {
      language: "English",
      title: "Important Update from {organizationName}",
      message: "An update for {productName} is ready to install.\nPlease save your work and close the application now to proceed."
    },
    French: {
      language: "French",
      title: "Mise à jour importante de {organizationName}",
      message: "Une mise à jour pour {productName} est prête à être installée.\nVeuillez enregistrer votre travail et fermer l'application maintenant pour continuer."
    },
    German: {
      language: "German",
      title: "Wichtiges Update von {organizationName}",
      message: "Ein Update für {productName} ist zur Installation bereit.\nBitte speichern Sie Ihre Arbeit und schließen Sie die Anwendung jetzt, um fortzufahren."
    },
    Spanish: {
      language: "Spanish",
      title: "Actualización importante de {organizationName}",
      message: "Una actualización para {productName} está lista para instalar.\nPor favor, guarde su trabajo y cierre la aplicación ahora para continuar."
    },
    Chinese: {
      language: "Chinese",
      title: "{organizationName}的重要更新",
      message: "{productName}的更新已准备就绪。\n请保存您的工作并立即关闭应用程序以继续。"
    },
    Arabic: {
      language: "Arabic",
      title: "تحديث مهم من {organizationName}",
      message: "تحديث {productName} جاهز للتثبيت.\nيرجى حفظ عملك وإغلاق التطبيق الآن للمتابعة."
    }
  });

  const [publishSchedule, setPublishSchedule] = useState<"immediate" | "scheduled">("immediate");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showEndUserNotifications, setShowEndUserNotifications] = useState<boolean>(true);
  const [useCustomMessage, setUseCustomMessage] = useState<boolean>(false);
  const [customMessage, setCustomMessage] = useState<string>("");

  useEffect(() => {
    if (location.state?.selectedApplications) {
      setApplications(location.state.selectedApplications);
      toast({
        title: "Applications loaded",
        description: `${location.state.selectedApplications.length} applications have been added to the task.`,
      });
    }
  }, [location.state]);

  const steps = [
    { id: "selectApplications", label: "Select Applications" },
    { id: "assignmentSettings", label: "Assignment Settings" },
    { id: "installationSettings", label: "Installation Settings" },
    { id: "publishSettings", label: "Publish Settings" },
    { id: "review", label: "Review & Save" },
  ];

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as WizardStep);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as WizardStep);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleRemoveApplication = (index: number) => {
    const newApplications = [...applications];
    newApplications.splice(index, 1);
    setApplications(newApplications);
  };

  const handleCustomizeApplication = (app: Application) => {
    const customizeAppData: ApplicationCustomizationData = {
      applicationName: app.applicationName,
      version: app.version,
      description: app.description || "",
      category: app.category ? [app.category] : [],
      publisher: app.vendor,
      informationUrl: app.informationUrl || "",
      privacyUrl: app.privacyUrl || "",
      developer: app.developer || "",
      owner: app.owner || "",
      notes: app.notes || "",
      featured: app.featured || false
    };
    
    setCustomizeApp(customizeAppData);
    setShowCustomizeDialog(true);
  };

  const handleAddAssignmentGroup = (type: "Required" | "Available") => {
    setCurrentAssignmentType(type);
    setShowAddAssignmentDialog(true);
  };

  const handleSaveAssignmentGroup = (groupData: AssignmentGroupData) => {
    const newGroup: AssignmentGroup = {
      id: Date.now().toString(),
      type: currentAssignmentType,
      groupName: groupData.groupName,
      groupMode: groupData.groupMode,
      filterMode: groupData.filterMode,
      filterName: groupData.filterName,
      appAvailability: groupData.appAvailability,
      installationDeadline: groupData.appInstallationDeadline,
      restartGracePeriod: groupData.restartGracePeriod,
    };
    
    setAssignmentGroups([...assignmentGroups, newGroup]);
    
    toast({
      title: "Assignment Group Added",
      description: `${groupData.groupName} has been added to ${currentAssignmentType} assignments.`,
    });
  };

  const handleDeleteAssignmentGroup = (id: string) => {
    setAssignmentGroups(assignmentGroups.filter(group => group.id !== id));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOrganizationLogo(file);
    }
  };

  const handleNotificationCustomization = (language: string, field: keyof NotificationCustomization, value: string) => {
    setNotificationCustomizations(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value
      }
    }));
  };

  const getNotificationPreview = (isDark: boolean) => {
    const customization = notificationCustomizations[selectedLanguage];
    const previewTitle = customization.title
      .replace("{organizationName}", "PatchTune")
      .replace("{productName}", "Google Chrome");
    const previewMessage = customization.message
      .replace("{organizationName}", "PatchTune")
      .replace("{productName}", "Google Chrome");

    return (
      <div className={cn(
        "rounded-lg p-4 shadow-lg",
        isDark 
          ? "bg-gray-800 text-white border border-gray-700" 
          : "bg-blue-50 text-gray-900"
      )}>
        <div className="flex items-center gap-3 mb-2">
          {organizationLogo ? (
            <img 
              src={URL.createObjectURL(organizationLogo)} 
              alt="Organization Logo" 
              className="w-8 h-8 rounded"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
              P
            </div>
          )}
          <h3 className="font-semibold">{previewTitle}</h3>
        </div>
        <p className="text-sm whitespace-pre-line">{previewMessage}</p>
        <div className="mt-3 text-sm">
          Installation will be initiated in <span className="font-medium">10:00</span>
        </div>
        <div className="mt-3 flex gap-2 justify-end">
          <Button 
            variant={isDark ? "default" : "secondary"}
            size="sm"
          >
            Update now
          </Button>
          <Button
            variant={isDark ? "outline" : "secondary"}
            size="sm"
          >
            Postpone
          </Button>
        </div>
      </div>
    );
  };

  const availableApplications: Application[] = [
    {
      applicationName: "Microsoft Office",
      vendor: "Microsoft",
      version: "365",
      releaseDate: "May 15, 2024",
      category: "Productivity",
      inventoryStatus: "Not Installed",
      publishStatus: "Not Published",
      publishTask: "Task 2"
    },
    {
      applicationName: "Adobe Photoshop",
      vendor: "Adobe",
      version: "25.2.0",
      releaseDate: "Apr 10, 2024",
      category: "Design",
      inventoryStatus: "Installed",
      publishStatus: "Updates Published",
      publishTask: "Task 3"
    },
    {
      applicationName: "Visual Studio Code",
      vendor: "Microsoft",
      version: "1.84.2",
      releaseDate: "May 2, 2024",
      category: "Development",
      inventoryStatus: "Installed",
      publishStatus: "Not Published",
      publishTask: "Task 4"
    }
  ];

  const filteredApplications = availableApplications.filter(app => 
    app.applicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddApplication = (app: Application) => {
    if (!applications.some(a => a.applicationName === app.applicationName)) {
      setApplications([...applications, app]);
    }
    setShowAddApplicationsDialog(false);
  };

  const getFilteredAssignmentGroups = (type: "Required" | "Available") => {
    return assignmentGroups.filter(group => group.type === type);
  };

  const handleCreateTask = () => {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const day2 = new Date(currentDate);
    day2.setDate(day2.getDate() + 2);
    
    const applNames = applications.map(app => app.applicationName).join(", ");
    const requiredGroups = getFilteredAssignmentGroups("Required")
      .map(group => group.groupName)
      .join(", ");
    
    const newTask: PublishTask = {
      id: Date.now().toString(),
      taskName: taskName || `Publish Task ${Math.floor(Math.random() * 10) + 1}`,
      taskType: "Updates Deployment",
      applications,
      deploymentType,
      assignmentGroups,
      installationBehavior,
      postponeAttempts: showNotificationSettings ? postponeAttempts : undefined,
      postponeNotificationTime: showNotificationSettings ? postponeNotificationTime : undefined,
      noResponseAction: showNotificationSettings ? noResponseAction : undefined,
      notificationCustomizations,
      organizationLogo: organizationLogo ? URL.createObjectURL(organizationLogo) : undefined,
      publishSchedule,
      selectedDate,
      showEndUserNotifications,
      useCustomMessage,
      customMessage,
      createdTime: formatTime(currentDate),
      lastRunTime: formatTime(tomorrow),
      nextRunTime: formatTime(day2),
      status: "Active",
      remarks: "All updates has been published successfully"
    };
    
    const existingTasks = JSON.parse(localStorage.getItem('publishTasks') || '[]');
    localStorage.setItem('publishTasks', JSON.stringify([...existingTasks, newTask]));
    
    toast({
      title: "Task Created Successfully",
      description: `Task "${newTask.taskName}" has been created and published.`,
    });
    
    navigate('/dashboard');
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    return `${formattedHours}.${minutes < 10 ? '0' + minutes : minutes} ${ampm}, ${day} ${month} ${year}`;
  };

  return (
    <div className={cn(
      "flex-1 overflow-auto",
      isDarkTheme ? "bg-gray-900 text-white" : "bg-[#f5f5f7] text-gray-800"
    )}>
      <div className="py-6 px-6">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <span className="text-sm text-gray-500">Intune / Publish Tasks / Create Task</span>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <div>
                  <label className={cn(
                    "block text-sm font-medium mb-1",
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  )}>
                    Task Name:
                  </label>
                  <Input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="My Task 1"
                    className="w-64"
                  />
                </div>
                <div>
                  <label className={cn(
                    "block text-sm font-medium mb-1",
                    isDarkTheme ? "text-gray-300" : "text-gray-700"
                  )}>
                    Task Type:
                  </label>
                  <div className={cn(
                    "px-3 py-2 border rounded-md",
                    isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"
                  )}>
                    Updates Deployment
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 flex flex-col items-center relative">
                {index > 0 && (
                  <div className={cn(
                    "absolute h-1 top-4 -left-1/2 right-1/2",
                    index <= steps.findIndex(s => s.id === currentStep) 
                      ? "bg-green-500" 
                      : "bg-gray-300"
                  )} />
                )}
                
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center z-10 mb-1 font-medium",
                  currentStep === step.id 
                    ? "bg-blue-500 text-white" 
                    : index < steps.findIndex(s => s.id === currentStep)
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-700"
                )}>
                  {index < steps.findIndex(s => s.id === currentStep) 
                    ? <Check className="h-4 w-4" /> 
                    : index + 1}
                </div>
                
                <span className={cn(
                  "text-sm text-center",
                  currentStep === step.id 
                    ? "text-blue-500 font-medium" 
                    : index < steps.findIndex(s => s.id === currentStep)
                      ? "text-green-500" 
                      : isDarkTheme 
                        ? "text-gray-400" 
                        : "text-gray-600"
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10">
          {currentStep === "selectApplications" && (
            <div className="space-y-4">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Selected Applications</h3>
                <Button 
                  size="sm"
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
                  onClick={() => setShowAddApplicationsDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  Add Applications
                </Button>
              </div>
              
              <div className={cn(
                "overflow-hidden rounded-lg border", 
                isDarkTheme ? "border-gray-700" : "border-gray-200"
              )}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={cn(
                    isDarkTheme ? "bg-gray-700" : "bg-gray-100"
                  )}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Application Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Latest Version
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={cn(
                    "divide-y",
                    isDarkTheme ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"
                  )}>
                    {applications.length > 0 ? (
                      applications.map((app, index) => (
                        <tr key={index} className={isDarkTheme ? "hover:bg-gray-750" : "hover:bg-gray-50"}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <img src="/src/resources/2chrome.png" alt="" className="w-6 h-6" />
                              {app.applicationName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{app.vendor}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{app.version}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {app.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="xs"
                                onClick={() => handleCustomizeApplication(app)}
                                className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                              >
                                <Settings className="h-4 w-4" />
                                Customize
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="xs"
                                onClick={() => handleRemoveApplication(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          No applications selected. Click "Add Applications" to select applications.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentStep === "assignmentSettings" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Assignment Settings</h3>
              <div className={cn(
                "p-6 rounded-lg border",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div className="space-y-4">
                  <div>
                    <p className="text-base font-medium mb-2">Deployment type:</p>
                    <RadioGroup 
                      value={deploymentType} 
                      onValueChange={(v) => setDeploymentType(v as "publishOnly" | "automateAssignment")}
                      className="flex items-center space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="publishOnly" id="publishOnly" />
                        <Label htmlFor="publishOnly">Publish Only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="automateAssignment" id="automateAssignment" />
                        <Label htmlFor="automateAssignment">Automate Assignment</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {deploymentType === "automateAssignment" && (
                    <div className="mt-6 space-y-8">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium">Required</h4>
                          <Button 
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 text-blue-500 border-blue-500"
                            onClick={() => handleAddAssignmentGroup("Required")}
                          >
                            <Plus className="h-4 w-4" />
                            Add Assignment group
                          </Button>
                        </div>
                        
                        <div className={cn(
                          "overflow-hidden rounded-lg border", 
                          isDarkTheme ? "border-gray-700" : "border-gray-200"
                        )}>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className={cn(
                              isDarkTheme ? "bg-gray-700" : "bg-gray-100"
                            )}>
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Group Mode
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Group Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Filter Mode
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Filter Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  App Availability
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Installation deadline
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Restart grace period
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className={cn(
                              "divide-y",
                              isDarkTheme ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"
                            )}>
                              {getFilteredAssignmentGroups("Required").length > 0 ? (
                                getFilteredAssignmentGroups("Required").map((group) => (
                                  <tr key={group.id} className={isDarkTheme ? "hover:bg-gray-750" : "hover:bg-gray-50"}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.groupMode}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.groupName}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.filterMode.substring(0, 20)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.filterName}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.appAvailability}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.installationDeadline}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.restartGracePeriod}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={() => handleDeleteAssignmentGroup(group.id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={8} className="px-4 py-3 text-center">
                                    No assignment groups added.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium">Available</h4>
                          <Button 
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 text-blue-500 border-blue-500"
                            onClick={() => handleAddAssignmentGroup("Available")}
                          >
                            <Plus className="h-4 w-4" />
                            Add Assignment group
                          </Button>
                        </div>
                        
                        <div className={cn(
                          "overflow-hidden rounded-lg border", 
                          isDarkTheme ? "border-gray-700" : "border-gray-200"
                        )}>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className={cn(
                              isDarkTheme ? "bg-gray-700" : "bg-gray-100"
                            )}>
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Group Mode
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Group Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Filter Mode
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Filter Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  App Availability
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Installation deadline
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Restart grace period
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className={cn(
                              "divide-y",
                              isDarkTheme ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"
                            )}>
                              {getFilteredAssignmentGroups("Available").length > 0 ? (
                                getFilteredAssignmentGroups("Available").map((group) => (
                                  <tr key={group.id} className={isDarkTheme ? "hover:bg-gray-750" : "hover:bg-gray-50"}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.groupMode}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.groupName}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.filterMode.substring(0, 20)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.filterName}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.appAvailability}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.installationDeadline}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.restartGracePeriod}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                      <Button
                                        variant="ghost"
                                        size="xs"
                                        onClick={() => handleDeleteAssignmentGroup(group.id)}
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={8} className="px-4 py-3 text-center">
                                    No assignment groups added.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === "installationSettings" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Installation Settings</h3>
              <div className={cn(
                "p-6 rounded-lg border space-y-6",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div>
                  <h4 className="text-base font-medium mb-3">Installation Behavior</h4>
                  <RadioGroup 
                    defaultValue={installationBehavior} 
                    onValueChange={setInstallationBehavior}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="skipIfRunning" id="skipIfRunning" />
                      <Label htmlFor="skipIfRunning">Skip installation when application is running</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="notifyUser" id="notifyUser" />
                      <Label htmlFor="notifyUser">Notify users and allow them to postpone installation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="forceClose" id="forceClose" />
                      <Label htmlFor="forceClose">Force close running applications during installation</Label>
                    </div>
                  </RadioGroup>
                </div>

                {installationBehavior === "notifyUser" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-medium">Notification Settings</h4>
                      <Switch 
                        checked={showNotificationSettings}
                        onCheckedChange={setShowNotificationSettings}
                      />
                    </div>
                    
                    {showNotificationSettings && (
                      <div className={cn(
                        "p-4 rounded border",
                        isDarkTheme ? "border-gray-600 bg-gray-800" : "border-gray-300 bg-gray-50"
                      )}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className={cn(
                              "block text-sm font-medium mb-1",
                              isDarkTheme ? "text-gray-300" : "text-gray-700"
                            )}>
                              Maximum allowed postpone attempts:
                            </label>
                            <Select 
                              value={postponeAttempts} 
                              onValueChange={setPostponeAttempts}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className={cn(
                              "block text-sm font-medium mb-1",
                              isDarkTheme ? "text-gray-300" : "text-gray-700"
                            )}>
                              Maximum postpone notification time (minutes):
                            </label>
                            <Select 
                              value={postponeNotificationTime} 
                              onValueChange={setPostponeNotificationTime}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5 minutes</SelectItem>
                                <SelectItem value="10">10 minutes</SelectItem>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <label className={cn(
                            "block text-sm font-medium mb-1",
                            isDarkTheme ? "text-gray-300" : "text-gray-700"
                          )}>
                            No response action:
                          </label>
                          <Select 
                            value={noResponseAction} 
                            onValueChange={setNoResponseAction}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="skip">Skip installation</SelectItem>
                              <SelectItem value="retry">Retry later</SelectItem>
                              <SelectItem value="forceClose">Force close application and install</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === "publishSettings" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Publish Settings</h3>
              <div className={cn(
                "p-6 rounded-lg border space-y-6",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div>
                  <h4 className="text-base font-medium mb-3">Auto-publish new versions</h4>
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch 
                      checked={autoPublishNewVersions}
                      onCheckedChange={setAutoPublishNewVersions}
                      id="auto-publish"
                    />
                    <Label htmlFor="auto-publish">Automatically publish new versions of selected applications</Label>
                  </div>
                  
                  {autoPublishNewVersions && (
                    <div className="ml-8 space-y-4">
                      <RadioGroup 
                        value={publishScheduleOption} 
                        onValueChange={(v) => setPublishScheduleOption(v as "wheneverReleased" | "schedule")}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="wheneverReleased" id="wheneverReleased" />
                          <Label htmlFor="wheneverReleased">Publish whenever new versions are released</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="schedule" id="schedule" />
                          <Label htmlFor="schedule">Publish on schedule</Label>
                        </div>
                      </RadioGroup>
                      
                      {publishScheduleOption === "schedule" && (
                        <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={cn(
                              "block text-sm font-medium mb-1",
                              isDarkTheme ? "text-gray-300" : "text-gray-700"
                            )}>
                              Frequency:
                            </label>
                            <Select value={frequency} onValueChange={(v) => setFrequency(v as "hourly" | "daily" | "weekly")}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className={cn(
                              "block text-sm font-medium mb-1",
                              isDarkTheme ? "text-gray-300" : "text-gray-700"
                            )}>
                              Start time:
                            </label>
                            <Input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="text-base font-medium mb-3">Application inclusion/exclusion policy</h4>
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch 
                      checked={addNewlyInstalled}
                      onCheckedChange={setAddNewlyInstalled}
                      id="add-new"
                    />
                    <Label htmlFor="add-new">Automatically add newly installed applications to publish task</Label>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-base font-medium mb-3">Cleanup policy</h4>
                  <div className="flex items-center gap-2">
                    <label className={cn(
                      "whitespace-nowrap text-sm font-medium",
                      isDarkTheme ? "text-gray-300" : "text-gray-700"
                    )}>
                      Delete inactive applications after
                    </label>
                    <Input
                      type="number"
                      className="w-20"
                      value={cleanupDays}
                      onChange={(e) => setCleanupDays(e.target.value)}
                      min="1"
                    />
                    <span>days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === "review" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Review & Save</h3>
              <div className={cn(
                "rounded-lg border",
                isDarkTheme ? "border-gray-700" : "border-gray-200"
              )}>
                <div className={cn(
                  "p-4 font-medium border-b",
                  isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"
                )}>
                  Summary
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Task Name</p>
                      <p className={cn(
                        "mt-1",
                        isDarkTheme ? "text-gray-400" : "text-gray-600"
                      )}>
                        {taskName || "My Task 1"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Task Type</p>
                      <p className={cn(
                        "mt-1",
                        isDarkTheme ? "text-gray-400" : "text-gray-600"
                      )}>
                        Updates Deployment
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Applications</p>
                      <p className={cn(
                        "mt-1",
                        isDarkTheme ? "text-gray-400" : "text-gray-600"
                      )}>
                        {applications.length > 0 
                          ? applications.map(app => app.applicationName).join(", ")
                          : "No applications selected"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Deployment Type</p>
                      <p className={cn(
                        "mt-1",
                        isDarkTheme ? "text-gray-400" : "text-gray-600"
                      )}>
                        {deploymentType === "publishOnly" ? "Publish Only" : "Automate Assignment"}
                      </p>
                    </div>
                    {deploymentType === "automateAssignment" && (
                      <div>
                        <p className="text-sm font-medium">Assignment Groups</p>
                        <p className={cn(
                          "mt-1",
                          isDarkTheme ? "text-gray-400" : "text-gray-600"
                        )}>
                          {assignmentGroups.length > 0 
                            ? assignmentGroups.map(group => `${group.groupName} (${group.type})`).join(", ")
                            : "No assignment groups added"}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">Installation Behavior</p>
                      <p className={cn(
                        "mt-1",
                        isDarkTheme ? "text-gray-400" : "text-gray-600"
                      )}>
                        {installationBehavior === "skipIfRunning" && "Skip installation when application is running"}
                        {installationBehavior === "notifyUser" && "Notify users and allow them to postpone installation"}
                        {installationBehavior === "forceClose" && "Force close running applications during installation"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          
          <div className="flex gap-2">
            {currentStep !== "selectApplications" && (
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            
            {currentStep !== "review" ? (
              <Button 
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
                onClick={handleNext}
                disabled={currentStep === "selectApplications" && applications.length === 0}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
                onClick={handleCreateTask}
              >
                <Check className="h-4 w-4" />
                Create Task
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showAddApplicationsDialog} onOpenChange={setShowAddApplicationsDialog}>
        <DialogContent className={cn(
          "max-w-3xl",
          isDarkTheme ? "bg-gray-800 text-white" : "bg-white"
        )}>
          <DialogTitle>Add Applications</DialogTitle>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search applications..."
                className="pl-9"
              />
            </div>
          </div>
          
          <div className={cn(
            "overflow-hidden rounded-lg border", 
            isDarkTheme ? "border-gray-700" : "border-gray-200"
          )}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={cn(
                isDarkTheme ? "bg-gray-700" : "bg-gray-100"
              )}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Application Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Latest Version
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={cn(
                "divide-y",
                isDarkTheme ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"
              )}>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app, index) => (
                    <tr key={index} className={isDarkTheme ? "hover:bg-gray-750" : "hover:bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img src="/src/resources/2chrome.png" alt="" className="w-6 h-6" />
                          {app.applicationName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{app.vendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{app.version}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {app.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddApplication(app)}
                          className="text-blue-500 hover:text-blue-700"
                          disabled={applications.some(a => a.applicationName === app.applicationName)}
                        >
                          {applications.some(a => a.applicationName === app.applicationName) 
                            ? "Added" 
                            : "Add"}
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      No applications found matching the search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {customizeApp && (
        <CustomizeApplicationDialog
          open={showCustomizeDialog}
          onOpenChange={setShowCustomizeDialog}
          applicationData={customizeApp}
          onSave={(customizedData) => {
            // Update application with customized data
            const updatedApplications = applications.map(app => {
              if (app.applicationName === customizedData.applicationName) {
                return {
                  ...app,
                  description: customizedData.description,
                  category: customizedData.category[0] || app.category,
                  vendor: customizedData.publisher,
                  informationUrl: customizedData.informationUrl,
                  privacyUrl: customizedData.privacyUrl,
                  developer: customizedData.developer,
                  owner: customizedData.owner,
                  notes: customizedData.notes,
                  featured: customizedData.featured
                };
              }
              return app;
            });
            
            setApplications(updatedApplications);
            setCustomizeApp(null);
          }}
          isDarkTheme={isDarkTheme}
        />
      )}

      <AddAssignmentGroupDialog
        open={showAddAssignmentDialog}
        onOpenChange={setShowAddAssignmentDialog}
        onSave={handleSaveAssignmentGroup}
        isDarkTheme={isDarkTheme}
        assignmentType={currentAssignmentType}
      />
    </div>
  );
};

export default PublishTaskWizard;
