
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  User,
  Settings,
  Bell,
  Lock,
  Mail,
  Phone,
  Shield,
  LogOut,
  Key,
  Clock,
  Globe,
  Moon,
  Sun,
  Languages,
  Palette,
  Camera,
  Upload,
  Save,
  FileText,
  History
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock admin user data
const mockAdminUser = {
  id: "admin-001",
  firstName: "Alex",
  lastName: "Morgan",
  jobTitle: "System Administrator",
  email: "admin@smartchess.com",
  phone: "+1 (555) 123-4567",
  avatar: "", // Empty for now, will use fallback
  lastLogin: "2025-05-05T18:30:22Z",
  twoFactorEnabled: true,
  createdAt: "2023-01-15T14:22:10Z",
  timezone: "America/New_York",
  language: "en",
  darkMode: true,
  rtlMode: false,
  colorTheme: "default",
  notifications: {
    email: true,
    push: true,
    systemAlerts: true,
    weeklyReports: true,
    securityAlerts: true
  }
};

// Mock activity log
const mockActivityLog = [
  {
    id: "act-001",
    action: "Login",
    timestamp: "2025-05-06T08:30:22Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
    device: "Chrome on Windows"
  },
  {
    id: "act-002",
    action: "Password Changed",
    timestamp: "2025-05-03T14:15:30Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
    device: "Chrome on Windows"
  },
  {
    id: "act-003",
    action: "System Settings Modified",
    timestamp: "2025-05-01T11:45:12Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
    device: "Firefox on MacOS"
  },
  {
    id: "act-004",
    action: "Backup Created",
    timestamp: "2025-04-28T09:22:05Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
    device: "Chrome on Windows"
  },
  {
    id: "act-005",
    action: "User Account Created",
    timestamp: "2025-04-25T16:10:45Z",
    ipAddress: "192.168.1.1",
    location: "New York, USA",
    device: "Chrome on Windows"
  }
];

const AdminProfile = () => {
  const { t, language, changeLanguage } = useLanguageContext();
  
  // State for form data
  const [personalInfo, setPersonalInfo] = useState({
    firstName: mockAdminUser.firstName,
    lastName: mockAdminUser.lastName,
    jobTitle: mockAdminUser.jobTitle,
    email: mockAdminUser.email,
    phone: mockAdminUser.phone
  });
  
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [preferences, setPreferences] = useState({
    timezone: mockAdminUser.timezone,
    language: mockAdminUser.language,
    darkMode: mockAdminUser.darkMode,
    rtlMode: mockAdminUser.rtlMode,
    colorTheme: mockAdminUser.colorTheme
  });
  
  const [notifications, setNotifications] = useState({
    email: mockAdminUser.notifications.email,
    push: mockAdminUser.notifications.push,
    systemAlerts: mockAdminUser.notifications.systemAlerts,
    weeklyReports: mockAdminUser.notifications.weeklyReports,
    securityAlerts: mockAdminUser.notifications.securityAlerts
  });
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(mockAdminUser.twoFactorEnabled);
  
  // Query for admin user data
  const { data: adminUser, isLoading } = useQuery({
    queryKey: ['adminUser'],
    queryFn: () => {
      // TODO: Replace with actual API call
      // return adminApi.getCurrentAdminUser();
      return Promise.resolve(mockAdminUser);
    }
  });
  
  // Query for activity log
  const { data: activityLog } = useQuery({
    queryKey: ['activityLog'],
    queryFn: () => {
      // TODO: Replace with actual API call
      // return adminApi.getActivityLog();
      return Promise.resolve(mockActivityLog);
    }
  });
  
  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof personalInfo) => {
      // TODO: Replace with actual API call
      // return adminApi.updateAdminProfile(data);
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      toast.success(t("Profile information updated successfully"));
    },
    onError: () => {
      toast.error(t("Failed to update profile information"));
    }
  });
  
  // Mutation for changing password
  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordInfo) => {
      // TODO: Replace with actual API call
      // return adminApi.changePassword(data);
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      toast.success(t("Password updated successfully"));
      setPasswordInfo({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    },
    onError: () => {
      toast.error(t("Failed to update password"));
    }
  });
  
  // Mutation for updating preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: Partial<typeof preferences>) => {
      // TODO: Replace with actual API call
      // return adminApi.updateAdminPreferences(data);
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 500);
      });
    },
    onSuccess: (_, variables) => {
      if (variables.language && variables.language !== language) {
        changeLanguage(variables.language as any);
      }
    }
  });
  
  // Mutation for updating notifications
  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: Partial<typeof notifications>) => {
      // TODO: Replace with actual API call
      // return adminApi.updateNotificationSettings(data);
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 500);
      });
    },
    onSuccess: () => {
      toast.success(t("Notification preferences updated"));
    }
  });
  
  // Mutation for updating 2FA status
  const update2FAMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      // TODO: Replace with actual API call
      // return adminApi.update2FASettings(enabled);
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: (_, enabled) => {
      toast.success(enabled ? 
        t("Two-factor authentication enabled") : 
        t("Two-factor authentication disabled"));
    }
  });
  
  const handleUpdateProfile = () => {
    updateProfileMutation.mutate(personalInfo);
  };
  
  const handleUpdatePassword = () => {
    // Basic validation
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      toast.error(t("New passwords do not match"));
      return;
    }
    
    if (passwordInfo.newPassword.length < 8) {
      toast.error(t("Password must be at least 8 characters"));
      return;
    }
    
    changePasswordMutation.mutate(passwordInfo);
  };
  
  const handleUpdatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    
    updatePreferencesMutation.mutate({
      [key]: value
    });
  };
  
  const handleUpdateNotification = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    
    updateNotificationsMutation.mutate({
      [key]: value
    });
  };
  
  const handleUpdate2FA = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    update2FAMutation.mutate(enabled);
  };
  
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("Admin Profile")}</h2>
          <p className="text-muted-foreground">
            {t("Manage your admin account and preferences")}
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          {t("Log Out")}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-48 w-full animate-pulse bg-muted rounded"></div>
          <div className="h-96 w-full animate-pulse bg-muted rounded"></div>
        </div>
      ) : (
        <>
          {/* Profile Header Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-32 relative">
              <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-card">
                    <AvatarImage src={adminUser?.avatar} />
                    <AvatarFallback className="text-2xl bg-primary/20">
                      {(adminUser?.firstName?.charAt(0) || '') + (adminUser?.lastName?.charAt(0) || '')}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="pt-16 pb-6 px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{adminUser?.firstName} {adminUser?.lastName}</h3>
                  <p className="text-muted-foreground">{adminUser?.jobTitle}</p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t("Last Login")}: {formatDateTime(adminUser?.lastLogin || '')}
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Shield className="h-4 w-4" />
                    {twoFactorEnabled ? t("2FA Enabled") : t("2FA Disabled")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Profile Content */}
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="personal" className="flex gap-2">
                <User className="h-4 w-4" />
                {t("Personal")}
              </TabsTrigger>
              <TabsTrigger value="security" className="flex gap-2">
                <Lock className="h-4 w-4" />
                {t("Security")}
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex gap-2">
                <Settings className="h-4 w-4" />
                {t("Preferences")}
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex gap-2">
                <History className="h-4 w-4" />
                {t("Activity")}
              </TabsTrigger>
            </TabsList>
            
            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Personal Information")}</CardTitle>
                  <CardDescription>
                    {t("Update your personal details and preferences")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("First Name")}</Label>
                      <Input 
                        id="firstName" 
                        value={personalInfo.firstName} 
                        onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("Last Name")}</Label>
                      <Input 
                        id="lastName" 
                        value={personalInfo.lastName} 
                        onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">{t("Job Title")}</Label>
                      <Input 
                        id="jobTitle" 
                        value={personalInfo.jobTitle} 
                        onChange={(e) => setPersonalInfo({...personalInfo, jobTitle: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-4">{t("Contact Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {t("Email")}
                        </Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={personalInfo.email} 
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t("Phone")}
                        </Label>
                        <Input 
                          id="phone" 
                          value={personalInfo.phone} 
                          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-4">
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={updateProfileMutation.isPending}
                    className="flex gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {updateProfileMutation.isPending ? t("Saving...") : t("Update Profile")}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("Notifications")}</CardTitle>
                  <CardDescription>
                    {t("Configure your notification preferences")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">{t("Email Notifications")}</Label>
                        <p className="text-muted-foreground text-sm">
                          {t("Receive notifications via email")}
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notifications.email}
                        onCheckedChange={(checked) => handleUpdateNotification('email', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications">{t("Push Notifications")}</Label>
                        <p className="text-muted-foreground text-sm">
                          {t("Receive browser push notifications")}
                        </p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notifications.push}
                        onCheckedChange={(checked) => handleUpdateNotification('push', checked)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">{t("Notification Types")}</h3>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="systemAlerts">{t("System Alerts")}</Label>
                      <Switch
                        id="systemAlerts"
                        checked={notifications.systemAlerts}
                        onCheckedChange={(checked) => handleUpdateNotification('systemAlerts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="weeklyReports">{t("Weekly Reports")}</Label>
                      <Switch
                        id="weeklyReports"
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => handleUpdateNotification('weeklyReports', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="securityAlerts">{t("Security Alerts")}</Label>
                      <Switch
                        id="securityAlerts"
                        checked={notifications.securityAlerts}
                        onCheckedChange={(checked) => handleUpdateNotification('securityAlerts', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Security")}</CardTitle>
                  <CardDescription>
                    {t("Manage your account security settings")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t("Current Password")}</Label>
                      <Input 
                        id="currentPassword" 
                        type="password"
                        value={passwordInfo.currentPassword} 
                        onChange={(e) => setPasswordInfo({...passwordInfo, currentPassword: e.target.value})}
                      />
                    </div>
                    
                    <div className="md:row-span-2">
                      <div className="p-4 border rounded-md bg-muted/50">
                        <h3 className="font-medium mb-2">{t("Password Requirements")}</h3>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            {t("At least 8 characters")}
                          </li>
                          <li className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            {t("At least 1 uppercase letter")}
                          </li>
                          <li className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            {t("At least 1 lowercase letter")}
                          </li>
                          <li className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            {t("At least 1 number")}
                          </li>
                          <li className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            {t("At least 1 special character")}
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t("New Password")}</Label>
                      <Input 
                        id="newPassword" 
                        type="password"
                        value={passwordInfo.newPassword} 
                        onChange={(e) => setPasswordInfo({...passwordInfo, newPassword: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("Confirm Password")}</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        value={passwordInfo.confirmPassword} 
                        onChange={(e) => setPasswordInfo({...passwordInfo, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-4">
                  <Button
                    onClick={handleUpdatePassword}
                    disabled={
                      changePasswordMutation.isPending || 
                      !passwordInfo.currentPassword ||
                      !passwordInfo.newPassword ||
                      !passwordInfo.confirmPassword
                    }
                    className="flex gap-2"
                  >
                    <Key className="h-4 w-4" />
                    {changePasswordMutation.isPending ? t("Updating...") : t("Change Password")}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("Authentication Settings")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium">{t("Two-Factor Authentication")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("Enable two-factor authentication to increase your account security")}
                      </p>
                    </div>
                    <div>
                      {twoFactorEnabled ? (
                        <Button 
                          variant="outline" 
                          onClick={() => handleUpdate2FA(false)}
                          disabled={update2FAMutation.isPending}
                        >
                          {update2FAMutation.isPending ? t("Disabling...") : t("Disable 2FA")}
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          onClick={() => handleUpdate2FA(true)}
                          disabled={update2FAMutation.isPending}
                        >
                          {update2FAMutation.isPending ? t("Enabling...") : t("Enable 2FA")}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">{t("API Tokens")}</h3>
                        <p className="text-sm text-muted-foreground">
                          {t("Manage your API access tokens")}
                        </p>
                      </div>
                      <Button variant="outline">
                        {t("Create Token")}
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <div className="text-center py-4">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">
                          {t("No API tokens created yet")}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("System Preferences")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">{t("Select your language")}</Label>
                      <Select
                        value={preferences.language}
                        onValueChange={(value) => handleUpdatePreference('language', value)}
                      >
                        <SelectTrigger id="language" className="flex gap-2">
                          <Languages className="h-4 w-4" />
                          <SelectValue placeholder={t("Select language")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">{t("Set your preferred timezone")}</Label>
                      <Select
                        value={preferences.timezone}
                        onValueChange={(value) => handleUpdatePreference('timezone', value)}
                      >
                        <SelectTrigger id="timezone" className="flex gap-2">
                          <Globe className="h-4 w-4" />
                          <SelectValue placeholder={t("Select timezone")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">(GMT-5:00) Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">(GMT-6:00) Central Time</SelectItem>
                          <SelectItem value="America/Denver">(GMT-7:00) Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">(GMT-8:00) Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">(GMT+0:00) London</SelectItem>
                          <SelectItem value="Europe/Paris">(GMT+1:00) Paris</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="darkMode" className="flex items-center gap-2">
                          {preferences.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                          {t("Dark Mode")}
                        </Label>
                        <p className="text-muted-foreground text-sm">
                          {preferences.darkMode ? t("Switch to light mode") : t("Switch to dark mode")}
                        </p>
                      </div>
                      <Switch
                        id="darkMode"
                        checked={preferences.darkMode}
                        onCheckedChange={(checked) => handleUpdatePreference('darkMode', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="rtlMode">{t("RTL Mode")}</Label>
                        <p className="text-muted-foreground text-sm">
                          {t("Right-to-left text direction")}
                        </p>
                      </div>
                      <Switch
                        id="rtlMode"
                        checked={preferences.rtlMode}
                        onCheckedChange={(checked) => handleUpdatePreference('rtlMode', checked)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="colorTheme" className="mb-4 block">{t("Color Theme")}</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {['default', 'blue', 'purple', 'green', 'orange'].map(theme => (
                        <div key={theme} className="text-center">
                          <button
                            type="button"
                            onClick={() => handleUpdatePreference('colorTheme', theme)}
                            className={`w-full aspect-square rounded-full mb-2 ${
                              theme === 'default' ? 'bg-primary/80' : 
                              theme === 'blue' ? 'bg-blue-500' :
                              theme === 'purple' ? 'bg-purple-500' :
                              theme === 'green' ? 'bg-green-500' :
                              'bg-orange-500'
                            } ${preferences.colorTheme === theme ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                          />
                          <span className="text-xs capitalize">
                            {t(theme === 'default' ? 'Default' : theme)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Activity Log")}</CardTitle>
                  <CardDescription>
                    {t("Recent account activity")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Action")}</TableHead>
                        <TableHead>{t("Time")}</TableHead>
                        <TableHead className="hidden md:table-cell">{t("IP Address")}</TableHead>
                        <TableHead className="hidden md:table-cell">{t("Location")}</TableHead>
                        <TableHead className="hidden md:table-cell">{t("Device")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLog?.map(activity => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium">
                            {activity.action}
                          </TableCell>
                          <TableCell>
                            {formatDateTime(activity.timestamp)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {activity.ipAddress}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {activity.location}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {activity.device}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </motion.div>
  );
};

export default AdminProfile;
