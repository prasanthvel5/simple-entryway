
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
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.filterMode.substring(0, 20)}...</td>
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
                                  <td colSpan={8} className="px-4 py-4 text-center text-sm">
                                    No assignment groups added. Click "Add Assignment group" to add a group.
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
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{group.filterMode.substring(0, 20)}...</td>
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
                                  <td colSpan={8} className="px-4 py-4 text-center text-sm">
                                    No assignment groups added. Click "Add Assignment group" to add a group.
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
                "p-6 rounded-lg border",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div className="space-y-6">
                  <div>
                    <p className="text-base font-medium mb-3">Installation behavior:</p>
                    <RadioGroup 
                      value={installationBehavior} 
                      onValueChange={setInstallationBehavior}
                      className="space-y-2"
                    >
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="skipIfRunning" id="skipIfRunning" />
                        <div>
                          <Label htmlFor="skipIfRunning" className="font-medium">Skip installation if application is running</Label>
                          <p className="text-sm text-gray-500">The installation will be skipped if the application is currently in use by the end user.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="waitAndNotify" id="waitAndNotify" />
                        <div>
                          <Label htmlFor="waitAndNotify" className="font-medium">Wait and notify end user</Label>
                          <p className="text-sm text-gray-500">Show a notification to the user and allow them to postpone the installation.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="forceClose" id="forceClose" />
                        <div>
                          <Label htmlFor="forceClose" className="font-medium">Force close application</Label>
                          <p className="text-sm text-gray-500">Automatically close the application and proceed with installation (warning: may cause unsaved work to be lost).</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {installationBehavior === "waitAndNotify" && (
                    <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Show notification settings</span>
                        <Switch 
                          checked={showNotificationSettings} 
                          onCheckedChange={setShowNotificationSettings} 
                        />
                      </div>
                      
                      {showNotificationSettings && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="postponeAttempts" className="text-sm">Maximum postpone attempts</Label>
                            <Select 
                              value={postponeAttempts} 
                              onValueChange={setPostponeAttempts}
                            >
                              <SelectTrigger id="postponeAttempts" className="w-full max-w-xs">
                                <SelectValue placeholder="Select maximum attempts" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 attempt</SelectItem>
                                <SelectItem value="3">3 attempts</SelectItem>
                                <SelectItem value="5">5 attempts</SelectItem>
                                <SelectItem value="10">10 attempts</SelectItem>
                                <SelectItem value="unlimited">Unlimited</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="postponeTime" className="text-sm">Postpone notification time (minutes)</Label>
                            <Select 
                              value={postponeNotificationTime} 
                              onValueChange={setPostponeNotificationTime}
                            >
                              <SelectTrigger id="postponeTime" className="w-full max-w-xs">
                                <SelectValue placeholder="Select time" />
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
                          
                          <div>
                            <Label htmlFor="noResponseAction" className="text-sm">Action when user doesn't respond</Label>
                            <Select 
                              value={noResponseAction} 
                              onValueChange={setNoResponseAction}
                            >
                              <SelectTrigger id="noResponseAction" className="w-full max-w-xs">
                                <SelectValue placeholder="Select action" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="wait">Wait indefinitely</SelectItem>
                                <SelectItem value="postpone">Automatically postpone</SelectItem>
                                <SelectItem value="forceClose">Force close application</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <p className="text-base font-medium mb-3">End-user notification customization:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="mb-4">
                          <Label htmlFor="logoUpload" className="block text-sm font-medium mb-1">Organization logo</Label>
                          <div className="flex items-center gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1"
                              onClick={() => document.getElementById('logoUpload')?.click()}
                            >
                              <Upload className="h-4 w-4" />
                              Upload Logo
                            </Button>
                            <input
                              id="logoUpload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoUpload}
                            />
                            {organizationLogo && (
                              <div className="flex items-center gap-1 text-sm">
                                <img 
                                  src={URL.createObjectURL(organizationLogo)} 
                                  alt="Logo Preview" 
                                  className="w-6 h-6 rounded"
                                />
                                <span className="text-gray-500">{organizationLogo.name}</span>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="xs"
                                  onClick={() => setOrganizationLogo(null)}
                                  className="text-red-500 hover:text-red-700 h-auto p-1"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="notificationLanguage" className="block text-sm font-medium mb-1">Language</Label>
                          <Select 
                            value={selectedLanguage} 
                            onValueChange={setSelectedLanguage}
                          >
                            <SelectTrigger id="notificationLanguage" className="w-full">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(notificationCustomizations).map(lang => (
                                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="notificationTitle" className="block text-sm font-medium mb-1">Notification title</Label>
                          <Input
                            id="notificationTitle"
                            value={notificationCustomizations[selectedLanguage].title}
                            onChange={(e) => handleNotificationCustomization(selectedLanguage, "title", e.target.value)}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Use {"{organizationName}"} and {"{productName}"} as placeholders
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="notificationMessage" className="block text-sm font-medium mb-1">Notification message</Label>
                          <Textarea
                            id="notificationMessage"
                            value={notificationCustomizations[selectedLanguage].message}
                            onChange={(e) => handleNotificationCustomization(selectedLanguage, "message", e.target.value)}
                            className="w-full h-24"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Use {"{organizationName}"} and {"{productName}"} as placeholders
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="mb-2">
                          <Label className="block text-sm font-medium mb-1">Preview</Label>
                        </div>
                        {getNotificationPreview(isDarkTheme)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === "publishSettings" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Publish Settings</h3>
              <div className={cn(
                "p-6 rounded-lg border",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div className="space-y-6">
                  <div>
                    <p className="text-base font-medium mb-3">Publish schedule:</p>
                    <RadioGroup 
                      value={publishSchedule} 
                      onValueChange={(v) => setPublishSchedule(v as "immediate" | "scheduled")}
                      className="space-y-2"
                    >
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="immediate" id="immediate" />
                        <div>
                          <Label htmlFor="immediate" className="font-medium">Publish immediately</Label>
                          <p className="text-sm text-gray-500">Deploy the applications right after creating this task.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="scheduled" id="scheduled" />
                        <div>
                          <Label htmlFor="scheduled" className="font-medium">Schedule for later</Label>
                          <p className="text-sm text-gray-500">Set a specific date and time to publish these applications.</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {publishSchedule === "scheduled" && (
                    <div className="space-y-3 pl-6 border-l-2 border-blue-200">
                      <div>
                        <Label htmlFor="scheduleDate" className="block text-sm font-medium mb-1">Schedule date and time</Label>
                        <Input
                          id="scheduleDate"
                          type="datetime-local"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full max-w-xs"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-base font-medium">Automate publishing for new versions:</p>
                      <Switch 
                        checked={autoPublishNewVersions} 
                        onCheckedChange={setAutoPublishNewVersions} 
                      />
                    </div>
                    
                    {autoPublishNewVersions && (
                      <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                        <div>
                          <p className="text-sm font-medium mb-2">When to publish new versions:</p>
                          <RadioGroup 
                            value={publishScheduleOption} 
                            onValueChange={(v) => setPublishScheduleOption(v as "wheneverReleased" | "schedule")}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="wheneverReleased" id="wheneverReleased" />
                              <Label htmlFor="wheneverReleased">Whenever new versions are released</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="schedule" id="schedulePublish" />
                              <Label htmlFor="schedulePublish">On a schedule</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        
                        {publishScheduleOption === "schedule" && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="frequency" className="block text-sm font-medium mb-1">Check frequency</Label>
                              <Select 
                                value={frequency} 
                                onValueChange={(v) => setFrequency(v as "hourly" | "daily" | "weekly")}
                              >
                                <SelectTrigger id="frequency" className="w-full max-w-xs">
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hourly">Hourly</SelectItem>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="startTime" className="block text-sm font-medium mb-1">Start time</Label>
                              <Input
                                id="startTime"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full max-w-xs"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Add newly installed applications to auto-publish task:</p>
                            <Switch 
                              checked={addNewlyInstalled} 
                              onCheckedChange={setAddNewlyInstalled} 
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="cleanupDays" className="block text-sm font-medium mb-1">
                              Cleanup superseded applications after (days):
                            </Label>
                            <Input
                              id="cleanupDays"
                              type="number"
                              min="0"
                              max="365"
                              value={cleanupDays}
                              onChange={(e) => setCleanupDays(e.target.value)}
                              className="w-28"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-base font-medium mb-3">End-user experience:</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show notifications to end users</p>
                          <p className="text-sm text-gray-500">Let users know when applications are being updated</p>
                        </div>
                        <Switch 
                          checked={showEndUserNotifications} 
                          onCheckedChange={setShowEndUserNotifications} 
                        />
                      </div>
                      
                      {showEndUserNotifications && (
                        <div className="space-y-3 pl-6 border-l-2 border-blue-200">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Use custom message for all applications:</p>
                            <Switch 
                              checked={useCustomMessage} 
                              onCheckedChange={setUseCustomMessage} 
                            />
                          </div>
                          
                          {useCustomMessage && (
                            <div>
                              <Label htmlFor="customMessage" className="block text-sm font-medium mb-1">Custom message:</Label>
                              <Textarea
                                id="customMessage"
                                value={customMessage}
                                onChange={(e) => setCustomMessage(e.target.value)}
                                placeholder="Enter a custom message that will be shown to users when applications are updated."
                                className="w-full h-24"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === "review" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Review & Save</h3>
              <div className={cn(
                "p-6 rounded-lg border",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-medium mb-2">Task Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Task Name:</p>
                        <p className="font-medium">{taskName || "Unnamed Task"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Task Type:</p>
                        <p className="font-medium">Updates Deployment</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Deployment Type:</p>
                        <p className="font-medium">{deploymentType === "publishOnly" ? "Publish Only" : "Automate Assignment"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Publish Schedule:</p>
                        <p className="font-medium">{publishSchedule === "immediate" ? "Immediate" : `Scheduled: ${selectedDate}`}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-base font-medium mb-2">Selected Applications ({applications.length})</h4>
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Application Name</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>Category</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applications.length > 0 ? (
                            applications.map((app, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <img src="/src/resources/2chrome.png" alt="" className="w-5 h-5" />
                                    {app.applicationName}
                                  </div>
                                </TableCell>
                                <TableCell>{app.vendor}</TableCell>
                                <TableCell>{app.version}</TableCell>
                                <TableCell>
                                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                    {app.category}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                No applications selected.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  {deploymentType === "automateAssignment" && (
                    <div>
                      <h4 className="text-base font-medium mb-2">Assignment Groups</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-1">Required ({getFilteredAssignmentGroups("Required").length})</p>
                          {getFilteredAssignmentGroups("Required").length > 0 ? (
                            <ul className="list-disc list-inside text-sm">
                              {getFilteredAssignmentGroups("Required").map(group => (
                                <li key={group.id}>{group.groupName} ({group.groupMode})</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No required assignment groups.</p>
                          )}
                        </div>
                        
                        <div>
                          <p className="text-sm font-semibold mb-1">Available ({getFilteredAssignmentGroups("Available").length})</p>
                          {getFilteredAssignmentGroups("Available").length > 0 ? (
                            <ul className="list-disc list-inside text-sm">
                              {getFilteredAssignmentGroups("Available").map(group => (
                                <li key={group.id}>{group.groupName} ({group.groupMode})</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">No available assignment groups.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-base font-medium mb-2">Installation Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Installation Behavior:</p>
                        <p className="font-medium">
                          {installationBehavior === "skipIfRunning" ? "Skip if running" : 
                           installationBehavior === "waitAndNotify" ? "Wait and notify" :
                           "Force close application"}
                        </p>
                      </div>
                      
                      {installationBehavior === "waitAndNotify" && showNotificationSettings && (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Max Postpone Attempts:</p>
                            <p className="font-medium">{postponeAttempts}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Postpone Time:</p>
                            <p className="font-medium">{postponeNotificationTime} minutes</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">No Response Action:</p>
                            <p className="font-medium">
                              {noResponseAction === "wait" ? "Wait indefinitely" : 
                               noResponseAction === "postpone" ? "Automatically postpone" :
                               "Force close application"}
                            </p>
                          </div>
                        </>
                      )}
                      
                      <div>
                        <p className="text-sm text-gray-500">Show End-User Notifications:</p>
                        <p className="font-medium">{showEndUserNotifications ? "Yes" : "No"}</p>
                      </div>
                      
                      {showEndUserNotifications && useCustomMessage && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Custom Message:</p>
                          <p className="font-medium whitespace-pre-wrap">{customMessage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {autoPublishNewVersions && (
                    <div>
                      <h4 className="text-base font-medium mb-2">Auto-Publish Settings</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Publish Schedule:</p>
                          <p className="font-medium">
                            {publishScheduleOption === "wheneverReleased" ? "Whenever new versions are released" : "On schedule"}
                          </p>
                        </div>
                        
                        {publishScheduleOption === "schedule" && (
                          <>
                            <div>
                              <p className="text-sm text-gray-500">Frequency:</p>
                              <p className="font-medium capitalize">{frequency}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Start Time:</p>
                              <p className="font-medium">{startTime}</p>
                            </div>
                          </>
                        )}
                        
                        <div>
                          <p className="text-sm text-gray-500">Add Newly Installed Apps:</p>
                          <p className="font-medium">{addNewlyInstalled ? "Yes" : "No"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500">Cleanup After:</p>
                          <p className="font-medium">{cleanupDays} days</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex items-center gap-1"
          >
            Cancel
          </Button>
          
          <div className="flex items-center gap-2">
            {currentStep !== "selectApplications" && (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            
            {currentStep !== "review" ? (
              <Button 
                onClick={handleNext}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
                disabled={currentStep === "selectApplications" && applications.length === 0}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreateTask}
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
              >
                Create Task
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showAddApplicationsDialog} onOpenChange={setShowAddApplicationsDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogTitle>Add Applications</DialogTitle>
          <div className="py-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Application Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {filteredApplications.map((app, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
                          onClick={() => handleAddApplication(app)}
                          size="sm"
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Add
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {customizeApp && (
        <CustomizeApplicationDialog 
          open={showCustomizeDialog} 
          onOpenChange={setShowCustomizeDialog}
          application={customizeApp}
          isDarkTheme={isDarkTheme}
          onSave={(data) => {
            // Implementation to update the application with customized data
            setApplications(prev => prev.map(app => 
              app.applicationName === customizeApp.applicationName
              ? { 
                  ...app, 
                  description: data.description,
                  category: data.category[0] || app.category,
                  vendor: data.publisher || app.vendor,
                  informationUrl: data.informationUrl,
                  privacyUrl: data.privacyUrl,
                  developer: data.developer,
                  owner: data.owner,
                  notes: data.notes,
                  featured: data.featured
                }
              : app
            ));
            setShowCustomizeDialog(false);
            setCustomizeApp(null);
            
            toast({
              title: "Application updated",
              description: "The application details have been updated successfully.",
            });
          }}
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
