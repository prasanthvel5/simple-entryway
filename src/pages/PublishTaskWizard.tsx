import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch"; // Make sure you have a Switch component
import { CustomizeApplicationDialog, ApplicationCustomizationData } from "@/components/dashboard/CustomizeApplicationDialog";
import { AddAssignmentGroupDialog, AssignmentGroupData } from "@/components/dashboard/AddAssignmentGroupDialog";

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

type DashboardContext = {
  isDarkTheme: boolean;
  activeMenu: string;
  activeSecondLevel: string;
};

const PublishTaskWizard = () => {
  const { isDarkTheme } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Single declaration for each state variable
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

  // Installation settings state
  const [installationBehavior, setInstallationBehavior] = useState("skipIfRunning");
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [postponeAttempts, setPostponeAttempts] = useState("5");
  const [postponeNotificationTime, setPostponeNotificationTime] = useState("10");
  const [noResponseAction, setNoResponseAction] = useState("forceClose");

  
  // Notification customization state
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
                  <div className="flex items-center gap-4">
                    <label className="block text-sm font-medium w-48">Installation behavior:</label>
                    <Select 
                      value={installationBehavior}
                      onValueChange={(value) => {
                        setInstallationBehavior(value);
                        setShowNotificationSettings(value === "allowUserDecide");
                      }}
                    >
                      <SelectTrigger className={cn(
                        "w-[300px]",
                        isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                      )}>
                        <SelectValue placeholder="Select behavior" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="skipIfRunning">Skip Installation if Application running</SelectItem>
                        <SelectItem value="closeAndUpdate">Close the application and update if Application running</SelectItem>
                        <SelectItem value="allowUserDecide">Allow user to decide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {showNotificationSettings && (
                    <div className="space-y-4 ml-4">
                      <div className="flex items-center gap-4">
                        <label className="block text-sm font-medium w-48">Postpone attempts:</label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            value={postponeAttempts}
                            onChange={(e) => setPostponeAttempts(e.target.value)}
                            className={cn(
                              "w-20",
                              isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                            )}
                          />
                          <span className="text-sm">Times</span>
                        </div>
                        <span className="text-sm text-gray-500 italic">
                          If user exceeds the {postponeAttempts} postpone attempts then the application will be closed and proceed for update installation
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="block text-sm font-medium w-48">Show postpone Notification for:</label>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="number"
                            value={postponeNotificationTime}
                            onChange={(e) => setPostponeNotificationTime(e.target.value)}
                            className={cn(
                              "w-20",
                              isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                            )}
                          />
                          <span className="text-sm">Minutes</span>
                        </div>
                        <span className="text-sm text-gray-500 italic">
                          Notification will appear for {postponeNotificationTime} minutes, If user didn't respond it will be either postpone or install based on below settings
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="block text-sm font-medium w-48">If user doesn't respond to notification:</label>
                        <Select 
                          value={noResponseAction}
                          onValueChange={setNoResponseAction}
                        >
                          <SelectTrigger className={cn(
                            "w-[300px]",
                            isDarkTheme ? "bg-gray-700 border-gray-600" : ""
                          )}>
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="forceClose">Force close the application and proceed install</SelectItem>
                            <SelectItem value="postpone">Postpone the installation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="mt-8">
                    <h4 className="text-lg font-medium mb-4">Notification Customization</h4>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Organization Logo</label>
                          <div className="flex items-center gap-4">
                            {organizationLogo ? (
                              <img 
                                src={URL.createObjectURL(organizationLogo)} 
                                alt="Organization Logo" 
                                className="w-12 h-12 rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Upload className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="logo-upload"
                                onChange={handleLogoUpload}
                              />
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                              >
                                Upload Logo
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Language</label>
                          <div className="flex flex-col gap-2">
                            {Object.keys(notificationCustomizations).map(lang => (
                              <button
                                key={lang}
                                onClick={() => setSelectedLanguage(lang)}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 rounded-md text-left",
                                  selectedLanguage === lang
                                    ? "bg-blue-500 text-white"
                                    : isDarkTheme
                                      ? "hover:bg-gray-700"
                                      : "hover:bg-gray-100"
                                )}
                              >
                                {selectedLanguage === lang && (
                                  <Check className="w-4 h-4" />
                                )}
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Notification Title</label>
                          <Input
                            value={notificationCustomizations[selectedLanguage].title}
                            onChange={(e) => handleNotificationCustomization(selectedLanguage, "title", e.target.value)}
                            className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Available placeholders: {"{organizationName}"}, {"{productName}"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Notification Message</label>
                          <Textarea
                            value={notificationCustomizations[selectedLanguage].message}
                            onChange={(e) => handleNotificationCustomization(selectedLanguage, "message", e.target.value)}
                            rows={4}
                            className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Available placeholders: {"{organizationName}"}, {"{productName}"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="font-medium">Preview</h5>
                        <div className="space-y-4">
                          <div>
                            <h6 className="text-sm font-medium mb-2">Light Theme</h6>
                            {getNotificationPreview(false)}
                          </div>
                          <div>
                            <h6 className="text-sm font-medium mb-2">Dark Theme</h6>
                            {getNotificationPreview(true)}
                          </div>
                        </div>
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Publish Schedule</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="radio" name="publishSchedule" id="immediate" className="mr-2" defaultChecked />
                        <label htmlFor="immediate">Publish immediately</label>
                      </div>
                      <div className="flex items-center">
                        <input type="radio" name="publishSchedule" id="scheduled" className="mr-2" />
                        <label htmlFor="scheduled">Scheduled</label>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <label className="block text-sm mb-1">Start Date:</label>
                    <input 
                      type="date" 
                      className={cn(
                        "rounded-md border px-3 py-2",
                        isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Notification Settings</label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input type="checkbox" id="endUserNotification" className="mr-2" defaultChecked />
                        <label htmlFor="endUserNotification">Show end-user notifications</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="customMessage" className="mr-2" />
                        <label htmlFor="customMessage">Use custom notification message</label>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <label className="block text-sm mb-1">Custom Message:</label>
                    <textarea 
                      className={cn(
                        "w-full rounded-md border px-3 py-2",
                        isDarkTheme ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                      )}
                      rows={3}
                      placeholder="Enter your custom notification message here..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === "review" && (
            <div>
              <h3 className="text-lg font-medium mb-4">Review and Save</h3>
              <div className={cn(
                "p-6 rounded-lg border",
                isDarkTheme ? "border-gray-700 bg-gray-750" : "border-gray-200 bg-gray-50"
              )}>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Task Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-sm text-gray-500">Task Name</span>
                        <span>{taskName || "My Task 1"}</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Task Type</span>
                        <span>Updates Deployment</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Selected Applications ({applications.length})</h4>
                    <ul className="list-disc ml-5 space-y-1">
                      {applications.map((app, index) => (
                        <li key={index}>{app.applicationName} ({app.version})</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Assignment Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-sm text-gray-500">Assignment Type</span>
                        <span>Required</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">Assigned Groups</span>
                        <span>Marketing Department, Sales Team</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Installation Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-sm text-gray-500">Installation Behavior</span>
                        <span>{installationBehavior === "skipIfRunning" 
                          ? "Skip Installation if Application running"
                          : installationBehavior === "closeAndUpdate"
                            ? "Close the application and update if Application running"
                            : "Allow user to decide"}</span>
                      </div>
                      {showNotificationSettings && (
                        <>
                          <div>
                            <span className="block text-sm text-gray-500">Postpone Attempts</span>
                            <span>{postponeAttempts} times</span>
                          </div>
                          <div>
                            <span className="block text-sm text-gray-500">Notification Time</span>
                            <span>{postponeNotificationTime} minutes</span>
                          </div>
                          <div>
                            <span className="block text-sm text-gray-500">No Response Action</span>
                            <span>{noResponseAction === "forceClose" 
                              ? "Force close and proceed install"
                              : "Postpone installation"}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Publish Settings</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-sm text-gray-500">Publish Schedule</span>
                        <span>Immediate</span>
                      </div>
                      <div>
                        <span className="block text-sm text-gray-500">End-User Notifications</span>
                        <span>Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className={isDarkTheme ? "bg-gray-700 border-gray-600" : ""}
          >
            Cancel
          </Button>
          
          {currentStep !== "selectApplications" && (
            <Button 
              variant="outline" 
              onClick={handleBack}
              className={cn(
                "flex items-center gap-1",
                isDarkTheme ? "bg-gray-700 border-gray-600" : ""
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          
          {currentStep !== "review" ? (
            <Button 
              onClick={handleNext}
              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={() => {
                navigate('/dashboard');
              }}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
            >
              Create Task
              <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showAddApplicationsDialog} onOpenChange={setShowAddApplicationsDialog}>
        <DialogContent className={cn(
          "max-w-2xl p-6",
          isDarkTheme ? "bg-gray-800 text-white" : "bg-white"
        )}>
          <DialogTitle className="text-xl font-semibold mb-4">Add Applications</DialogTitle>
          
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search applications..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={cn(
            "overflow-hidden rounded-lg border mb-4", 
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
                    Version
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
                {filteredApplications.map((app, index) => (
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
                      <Button 
                        variant="ghost" 
                        size="xs"
                        onClick={() => handleAddApplication(app)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowAddApplicationsDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CustomizeApplicationDialog
        application={customizeApp}
        open={showCustomizeDialog}
        onOpenChange={setShowCustomizeDialog}
        isDarkTheme={isDarkTheme}
      />

      <AddAssignmentGroupDialog
        open={showAddAssignmentDialog}
        onOpenChange={setShowAddAssignmentDialog}
        isDarkTheme={isDarkTheme}
        onSave={handleSaveAssignmentGroup}
      />
    </div>
  );
};

export default PublishTaskWizard;