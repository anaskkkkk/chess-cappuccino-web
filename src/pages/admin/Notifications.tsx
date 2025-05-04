
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { notificationsApi } from "@/services/api/endpoints/notificationsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCheck,
  Filter,
  Plus,
  Send,
  Settings,
  Trash,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Notification type definition
type Notification = {
  id: string;
  title: string;
  message: string;
  type: "system" | "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  target?: "all" | "admins" | "players";
  link?: string;
};

const Notifications = () => {
  const { t } = useLanguageContext();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("manage");
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    target: "all",
    link: "",
  });
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["adminNotifications"],
    queryFn: async () => {
      const response = await notificationsApi.getNotifications(1, 100);
      return response.data || [];
    },
  });
  
  // Fetch notification settings
  const { data: settings } = useQuery({
    queryKey: ["notificationSettings"],
    queryFn: async () => {
      const response = await notificationsApi.getNotificationSettings();
      return response.data || {
        emailNotifications: true,
        pushNotifications: true,
        systemNotifications: true,
        digest: "daily",
        categories: {
          system: true,
          tournaments: true,
          games: true,
          learning: true,
          store: true,
        }
      };
    },
  });
  
  // Create notification mutation
  const createNotificationMutation = useMutation({
    mutationFn: async (notificationData: any) => {
      return await notificationsApi.createAdminNotification(notificationData);
    },
    onSuccess: () => {
      toast.success(t("Notification sent successfully"));
      setNewNotification({
        title: "",
        message: "",
        type: "info",
        target: "all",
        link: "",
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
    onError: (error) => {
      toast.error(`${t("Failed to send notification")}: ${error.message || t("Please try again")}`);
    },
  });
  
  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await notificationsApi.deleteNotification(notificationId);
    },
    onSuccess: () => {
      toast.success(t("Notification deleted"));
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
    onError: (error) => {
      toast.error(`${t("Failed to delete notification")}: ${error.message || t("Please try again")}`);
    },
  });
  
  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await notificationsApi.markAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
  });
  
  // Mark all notifications as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await notificationsApi.markAllAsRead();
    },
    onSuccess: () => {
      toast.success(t("All notifications marked as read"));
      queryClient.invalidateQueries({ queryKey: ["adminNotifications"] });
    },
    onError: (error) => {
      toast.error(`${t("Failed to mark all as read")}: ${error.message || t("Please try again")}`);
    },
  });
  
  // Update notification settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      return await notificationsApi.updateNotificationSettings(settings);
    },
    onSuccess: () => {
      toast.success(t("Notification settings updated"));
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
    },
    onError: (error) => {
      toast.error(`${t("Failed to update settings")}: ${error.message || t("Please try again")}`);
    },
  });
  
  // Handle new notification submission
  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error(t("Please fill in all required fields"));
      return;
    }
    
    createNotificationMutation.mutate(newNotification);
  };
  
  // Handle notification settings update
  const handleUpdateSettings = (settings: any) => {
    updateSettingsMutation.mutate(settings);
  };
  
  // Get notification badge color based on type
  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "error":
        return <Badge variant="destructive">{type}</Badge>;
      case "warning":
        return <Badge variant="warning" className="bg-yellow-500">{type}</Badge>;
      case "success":
        return <Badge variant="default" className="bg-green-500">{type}</Badge>;
      case "info":
        return <Badge variant="secondary">{type}</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };
  
  // Filter notifications
  const filteredNotifications = notifications.filter((notification: Notification) => {
    if (filterType !== "all" && notification.type !== filterType) return false;
    
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-chess-text-light">{t("Notifications")}</h1>
          <p className="text-sm text-chess-text-light/70 mt-1">
            {t("Manage system notifications and user communications")}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>{t("Create Notification")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t("Create New Notification")}</DialogTitle>
                <DialogDescription>
                  {t("Send a notification to users of the platform")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="notification-type" className="col-span-4">
                    {t("Notification Type")}
                  </Label>
                  <Select 
                    value={newNotification.type} 
                    onValueChange={(value) => setNewNotification({...newNotification, type: value})}
                  >
                    <SelectTrigger id="notification-type" className="col-span-4">
                      <SelectValue placeholder={t("Select type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">{t("Information")}</SelectItem>
                      <SelectItem value="success">{t("Success")}</SelectItem>
                      <SelectItem value="warning">{t("Warning")}</SelectItem>
                      <SelectItem value="error">{t("Error")}</SelectItem>
                      <SelectItem value="system">{t("System")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="notification-target" className="col-span-4">
                    {t("Target Audience")}
                  </Label>
                  <Select 
                    value={newNotification.target} 
                    onValueChange={(value) => setNewNotification({...newNotification, target: value})}
                  >
                    <SelectTrigger id="notification-target" className="col-span-4">
                      <SelectValue placeholder={t("Select target audience")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Users")}</SelectItem>
                      <SelectItem value="admins">{t("Administrators")}</SelectItem>
                      <SelectItem value="players">{t("Players Only")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="notification-title" className="col-span-4">
                    {t("Title")}
                  </Label>
                  <Input
                    id="notification-title"
                    className="col-span-4"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    placeholder={t("Enter notification title")}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="notification-message" className="col-span-4">
                    {t("Message")}
                  </Label>
                  <Textarea
                    id="notification-message"
                    className="col-span-4"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    placeholder={t("Enter notification message")}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="notification-link" className="col-span-4">
                    {t("Link")} ({t("Optional")})
                  </Label>
                  <Input
                    id="notification-link"
                    className="col-span-4"
                    value={newNotification.link}
                    onChange={(e) => setNewNotification({...newNotification, link: e.target.value})}
                    placeholder={t("Enter URL for notification action (optional)")}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t("Cancel")}
                </Button>
                <Button 
                  onClick={handleCreateNotification} 
                  className="flex items-center gap-1"
                  disabled={!newNotification.title || !newNotification.message}
                >
                  <Send className="h-4 w-4" />
                  {t("Send Notification")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => markAllAsReadMutation.mutate()} className="flex items-center gap-1">
            <CheckCheck className="h-4 w-4" />
            <span>{t("Mark All as Read")}</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="manage" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="manage">
            <Bell className="h-4 w-4 mr-2" />
            {t("Manage Notifications")}
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            {t("Notification Settings")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left sidebar with filters */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Filters")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium mb-1" htmlFor="search">
                      {t("Search")}
                    </Label>
                    <Input
                      id="search"
                      placeholder={t("Search notifications...")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium mb-1" htmlFor="type">
                      {t("Notification Type")}
                    </Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder={t("Select type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("All Types")}</SelectItem>
                        <SelectItem value="info">{t("Information")}</SelectItem>
                        <SelectItem value="success">{t("Success")}</SelectItem>
                        <SelectItem value="warning">{t("Warning")}</SelectItem>
                        <SelectItem value="error">{t("Error")}</SelectItem>
                        <SelectItem value="system">{t("System")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm flex items-center mb-2">
                      <Filter className="h-4 w-4 mr-1" />
                      {t("Active Filters")}
                    </p>
                    {(searchQuery || filterType !== "all") ? (
                      <div className="space-y-1">
                        {searchQuery && (
                          <div className="flex items-center justify-between bg-gray-800/30 px-2 py-1 rounded text-sm">
                            <span>{t("Search")}: {searchQuery}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0" 
                              onClick={() => setSearchQuery("")}
                            >
                              ×
                            </Button>
                          </div>
                        )}
                        {filterType !== "all" && (
                          <div className="flex items-center justify-between bg-gray-800/30 px-2 py-1 rounded text-sm">
                            <span>{t("Type")}: {filterType}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0" 
                              onClick={() => setFilterType("all")}
                            >
                              ×
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">
                        {t("No active filters")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right side - notifications list */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>{t("System Notifications")}</CardTitle>
                  <CardDescription>
                    {t("Recent notifications sent to users in the system")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col space-y-2 animate-pulse">
                          <div className="bg-gray-700/30 h-6 w-3/4 rounded"></div>
                          <div className="bg-gray-700/30 h-4 w-full rounded"></div>
                          <div className="bg-gray-700/30 h-4 w-1/2 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredNotifications.length > 0 ? (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {filteredNotifications.map((notification: Notification) => (
                        <Card key={notification.id} className={`bg-gray-800/30 border ${
                          !notification.isRead ? 'border-l-4 border-l-chess-accent' : 'border-gray-700'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                              <div className="flex items-start gap-2">
                                <h3 className="font-medium text-chess-text-light">{notification.title}</h3>
                                {getNotificationBadge(notification.type)}
                                {notification.target && (
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {notification.target}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatTimestamp(notification.createdAt)}
                              </div>
                            </div>
                            <p className="text-sm text-chess-text-light/80 mb-3">
                              {notification.message}
                            </p>
                            <div className="flex justify-between items-center">
                              {notification.link && (
                                <a 
                                  href={notification.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-chess-accent hover:underline"
                                >
                                  {t("View Details")}
                                </a>
                              )}
                              <div className="ml-auto flex items-center gap-2">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => markAsReadMutation.mutate(notification.id)}
                                  >
                                    <CheckCheck className="h-4 w-4 mr-1" />
                                    {t("Mark as Read")}
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs text-red-500"
                                  onClick={() => deleteNotificationMutation.mutate(notification.id)}
                                >
                                  <Trash className="h-4 w-4 mr-1" />
                                  {t("Delete")}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>{t("No notifications found")}</p>
                      {(searchQuery || filterType !== "all") && (
                        <p className="mt-2 text-sm">
                          {t("Try adjusting your filters")}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-between">
                  <div className="text-sm text-gray-500">
                    {filteredNotifications.length} {t("notifications")}
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    {t("View All")}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("Global Notification Settings")}</CardTitle>
                <CardDescription>
                  {t("Configure how notifications are delivered to users")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t("Email Notifications")}</Label>
                    <p className="text-sm text-chess-text-light/70">
                      {t("Send notifications to users via email")}
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.emailNotifications} 
                    onCheckedChange={(checked) => {
                      handleUpdateSettings({
                        ...settings,
                        emailNotifications: checked
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t("Push Notifications")}</Label>
                    <p className="text-sm text-chess-text-light/70">
                      {t("Send notifications to mobile devices")}
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.pushNotifications} 
                    onCheckedChange={(checked) => {
                      handleUpdateSettings({
                        ...settings,
                        pushNotifications: checked
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">{t("System Notifications")}</Label>
                    <p className="text-sm text-chess-text-light/70">
                      {t("Show notifications in the web application")}
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.systemNotifications} 
                    onCheckedChange={(checked) => {
                      handleUpdateSettings({
                        ...settings,
                        systemNotifications: checked
                      });
                    }}
                  />
                </div>
                
                <div>
                  <Label className="text-base mb-2 block">{t("Notification Digest")}</Label>
                  <p className="text-sm text-chess-text-light/70 mb-2">
                    {t("How often to send notification digests")}
                  </p>
                  <Select 
                    value={settings?.digest} 
                    onValueChange={(value) => {
                      handleUpdateSettings({
                        ...settings,
                        digest: value
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select frequency")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">{t("Real-time")}</SelectItem>
                      <SelectItem value="daily">{t("Daily Digest")}</SelectItem>
                      <SelectItem value="weekly">{t("Weekly Digest")}</SelectItem>
                      <SelectItem value="never">{t("Never")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("Notification Categories")}</CardTitle>
                <CardDescription>
                  {t("Select which types of notifications to send")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">{t("System Updates")}</Label>
                    <p className="text-sm text-chess-text-light/70">
                      {t("Maintenance, updates, and important announcements")}
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.categories?.system} 
                    onCheckedChange={(checked) => {
                      handleUpdateSettings({
                        ...settings,
                        categories: {
                          ...settings?.categories,
                          system: checked
                        }
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">{t("Tournaments")}</Label>
                    <p className="text-sm text-chess-text-light/70">
                      {t("Tournament announcements, invitations, and results")}
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.categories?.tournaments} 
                    onCheckedChange={(checked) => {
                      handleUpdateSettings({
                        ...settings,
                        categories: {
                          ...settings?.categories,
                          tournaments: checked
                        }
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">{t("Games")}</Label>
                    <p className="text-sm text-chess-text-light/70">
                      {t("Game invitations, turns, and results")}
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.categories?.games} 
                    onCheckedChange={(checked) => {
                      handleUpdateSettings({
                        ...settings,
                        categories: {
                          ...settings?.categories,
                          games: checked
                        }
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">{t("Learning")}</Label>
                    <p className="text-sm text-chess-text-light/70">
                      {t("Course updates, achievements, and recommendations")}
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.categories?.learning} 
                    onCheckedChange={(checked) => {
                      handleUpdateSettings({
                        ...settings,
                        categories: {
                          ...settings?.categories,
                          learning: checked
                        }
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">{t("Store")}</Label>
                    <p className="text-sm text-chess-text-light/70">
                      {t("Order updates, promotions, and new products")}
                    </p>
                  </div>
                  <Switch 
                    checked={settings?.categories?.store} 
                    onCheckedChange={(checked) => {
                      handleUpdateSettings({
                        ...settings,
                        categories: {
                          ...settings?.categories,
                          store: checked
                        }
                      });
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
