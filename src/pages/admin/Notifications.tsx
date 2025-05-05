
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { notificationsApi } from "@/services/api/endpoints/notificationsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  RefreshCw,
  Search,
  Filter,
  Send,
  CheckCheck,
  Trash2,
  X,
  BellRing,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Notification type
type NotificationType = "system" | "game" | "tournament" | "marketing" | "all";

// Notification interface
interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
}

// Notification settings interface
interface NotificationSettings {
  emailEnabled: boolean;
  emailGameInvites: boolean;
  emailTournamentUpdates: boolean;
  emailSystemAnnouncements: boolean;
  emailMarketingEmails: boolean;
  pushEnabled: boolean;
  pushYourTurn: boolean;
  pushFriendActivity: boolean;
  pushSystemAnnouncements: boolean;
  inAppEnabled: boolean;
  inAppGameInvites: boolean;
  inAppTournamentUpdates: boolean;
  inAppSystemAnnouncements: boolean;
}

// New notification form data
interface NewNotificationForm {
  title: string;
  content: string;
  type: NotificationType;
  target: "all" | "players" | "admins" | "premium";
}

const Notifications: React.FC = () => {
  const { t } = useLanguageContext();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"notifications" | "settings">("notifications");
  const [notificationsFilter, setNotificationsFilter] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Form state for new notification
  const [newNotification, setNewNotification] = useState<NewNotificationForm>({
    title: "",
    content: "",
    type: "system",
    target: "all",
  });

  // Fetch notifications
  const {
    data: notificationsData = [],
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["notifications", notificationsFilter, typeFilter, searchTerm],
    queryFn: async () => {
      try {
        const response = await notificationsApi.getNotifications({
          read: notificationsFilter === "all" ? undefined : false,
          type: typeFilter === "all" ? undefined : typeFilter,
          search: searchTerm || undefined,
        });
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        toast.error("Failed to load notifications");
        return [];
      }
    },
  });

  // Fetch notification settings
  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ["notificationSettings"],
    queryFn: async () => {
      try {
        const response = await notificationsApi.getNotificationSettings();
        return response.data || {
          emailEnabled: true,
          emailGameInvites: true,
          emailTournamentUpdates: true,
          emailSystemAnnouncements: true,
          emailMarketingEmails: false,
          pushEnabled: true,
          pushYourTurn: true,
          pushFriendActivity: false,
          pushSystemAnnouncements: true,
          inAppEnabled: true,
          inAppGameInvites: true,
          inAppTournamentUpdates: true,
          inAppSystemAnnouncements: true,
        };
      } catch (error) {
        console.error("Failed to fetch notification settings:", error);
        toast.error("Could not load notification settings");
        throw error;
      }
    },
    retry: 1,
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return notificationsApi.markNotificationAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(t("Notification marked as read"));
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
      toast.error(t("Failed to mark notification as read"));
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return notificationsApi.markAllNotificationsAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(t("All notifications marked as read"));
    },
    onError: (error) => {
      console.error("Failed to mark all notifications as read:", error);
      toast.error(t("Failed to mark all notifications as read"));
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      return notificationsApi.deleteNotification(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(t("Notification deleted"));
    },
    onError: (error) => {
      console.error("Failed to delete notification:", error);
      toast.error(t("Failed to delete notification"));
    },
  });

  // Update notification settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<NotificationSettings>) => {
      return notificationsApi.updateNotificationSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
      toast.success(t("Notification settings updated"));
    },
    onError: (error) => {
      console.error("Failed to update notification settings:", error);
      toast.error(t("Failed to update settings"));
    },
  });

  // Send notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: NewNotificationForm) => {
      return notificationsApi.sendNotification(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(t("Notification sent"));
      setIsCreateOpen(false);
      setNewNotification({
        title: "",
        content: "",
        type: "system",
        target: "all",
      });
    },
    onError: (error) => {
      console.error("Failed to send notification:", error);
      toast.error(t("Failed to send notification"));
    },
  });

  // Handle notification setting change
  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    if (settingsData) {
      updateSettingsMutation.mutate({ [key]: value });
    }
  };

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewNotification((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setNewNotification((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotification.title || !newNotification.content) {
      toast.error("Title and content are required");
      return;
    }
    sendNotificationMutation.mutate(newNotification);
  };

  // Get notification type badge
  const getNotificationTypeBadge = (type: NotificationType) => {
    let variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | null
      | undefined;
    
    switch (type) {
      case "system":
        variant = "secondary";
        break;
      case "game":
        variant = "default";
        break;
      case "tournament":
        variant = "outline";
        break;
      case "marketing":
        variant = "destructive";
        break;
      default:
        variant = "secondary";
    }
    
    return (
      <Badge variant={variant} className="text-xs">
        {type.toUpperCase()}
      </Badge>
    );
  };

  // Filter notifications by search term
  const filteredNotifications = notificationsData.filter((notification) => {
    if (searchTerm === "") return true;
    return (
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
    exit: { opacity: 0, x: -10 },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-chess-text-light">{t("Notifications")}</h1>
          <p className="text-sm text-chess-text-light/70 mt-1">
            {t("Manage system notifications and user communications")}
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-chess-accent hover:bg-chess-accent/80">
              <Bell className="h-4 w-4 mr-2" />
              {t("Create Notification")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("Create New Notification")}</DialogTitle>
              <DialogDescription>
                {t("Send a notification to users of the platform")}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    {t("Title")}
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={newNotification.title}
                    onChange={handleInputChange}
                    placeholder={t("Notification title")}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">
                    {t("Content")}
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={newNotification.content}
                    onChange={handleInputChange}
                    placeholder={t("Write your message here")}
                    className="col-span-3"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    {t("Type")}
                  </Label>
                  <Select
                    name="type"
                    value={newNotification.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("Select type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="game">Game</SelectItem>
                      <SelectItem value="tournament">Tournament</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="target" className="text-right">
                    {t("Recipients")}
                  </Label>
                  <Select
                    name="target"
                    value={newNotification.target}
                    onValueChange={(value) => handleSelectChange("target", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={t("Select target")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Users")}</SelectItem>
                      <SelectItem value="players">{t("Players Only")}</SelectItem>
                      <SelectItem value="admins">{t("Admins Only")}</SelectItem>
                      <SelectItem value="premium">{t("Premium Users")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  {t("Cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !newNotification.title ||
                    !newNotification.content ||
                    sendNotificationMutation.isPending
                  }
                >
                  {sendNotificationMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {t("Send Notification")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              {t("Notifications")}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <BellRing className="h-4 w-4 mr-2" />
              {t("Settings")}
            </TabsTrigger>
          </TabsList>

          {activeTab === "notifications" && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchNotifications()}
                disabled={isLoadingNotifications}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingNotifications ? "animate-spin" : ""}`} />
                {t("Refresh")}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsReadMutation.mutate()}
                disabled={
                  isLoadingNotifications || markAllAsReadMutation.isPending || filteredNotifications.length === 0
                }
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                {t("Mark All as Read")}
              </Button>
              
              <Select
                value={notificationsFilter}
                onValueChange={(v) => setNotificationsFilter(v as "all" | "unread")}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All")}</SelectItem>
                  <SelectItem value="unread">{t("Unread")}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as NotificationType)}
              >
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Types")}</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="game">Game</SelectItem>
                  <SelectItem value="tournament">Tournament</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder={t("Search...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-auto"
                />
              </div>
            </div>
          )}
        </div>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {isLoadingNotifications ? (
                <div className="flex justify-center items-center h-40">
                  <RefreshCw className="h-8 w-8 animate-spin text-chess-accent" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center py-16 text-chess-text-light/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Bell className="h-16 w-16 mb-4 opacity-20" />
                  <h3 className="text-xl font-medium">
                    {notificationsFilter === "unread"
                      ? t("No unread notifications")
                      : t("No notifications")}
                  </h3>
                  <p className="text-sm mt-1">
                    {notificationsFilter === "unread"
                      ? t("You've read all your notifications")
                      : t("You don't have any notifications at the moment")}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        variants={itemVariants}
                        exit="exit"
                        layout
                        className={`p-4 rounded-lg border ${
                          notification.read ? "bg-transparent" : "bg-chess-accent/5"
                        }`}
                      >
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div className="flex items-center gap-2">
                            {getNotificationTypeBadge(notification.type)}
                            <span className="text-xs text-gray-400">
                              {new Date(notification.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                disabled={markAsReadMutation.isPending}
                              >
                                <CheckCheck className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-600"
                              onClick={() => deleteNotificationMutation.mutate(notification.id)}
                              disabled={deleteNotificationMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="text-lg font-medium mt-2 text-chess-text-light">
                          {notification.title}
                        </h3>
                        <p className="text-sm mt-1 text-chess-text-light/80">
                          {notification.content}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Email Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Email Notifications")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSettings ? (
                  <div className="flex justify-center items-center h-40">
                    <RefreshCw className="h-8 w-8 animate-spin text-chess-accent" />
                  </div>
                ) : !settingsData ? (
                  <div className="flex flex-col items-center justify-center py-8 text-chess-text-light/60">
                    <X className="h-12 w-12 mb-2 opacity-20" />
                    <h3 className="text-lg font-medium">{t("Settings unavailable")}</h3>
                    <p className="text-sm mt-1">{t("Could not load notification settings")}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => refetchSettings()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("Try Again")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{t("Enable Email Notifications")}</Label>
                      </div>
                      <Switch
                        checked={settingsData.emailEnabled}
                        onCheckedChange={(checked) =>
                          handleSettingChange("emailEnabled", checked)
                        }
                      />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label
                          className={
                            !settingsData.emailEnabled ? "text-chess-text-light/40" : ""
                          }
                        >
                          {t("Game Invites")}
                        </Label>
                        <Switch
                          disabled={!settingsData.emailEnabled}
                          checked={
                            settingsData.emailEnabled && settingsData.emailGameInvites
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange("emailGameInvites", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          className={
                            !settingsData.emailEnabled ? "text-chess-text-light/40" : ""
                          }
                        >
                          {t("Tournament Updates")}
                        </Label>
                        <Switch
                          disabled={!settingsData.emailEnabled}
                          checked={
                            settingsData.emailEnabled &&
                            settingsData.emailTournamentUpdates
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange("emailTournamentUpdates", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          className={
                            !settingsData.emailEnabled ? "text-chess-text-light/40" : ""
                          }
                        >
                          {t("System Announcements")}
                        </Label>
                        <Switch
                          disabled={!settingsData.emailEnabled}
                          checked={
                            settingsData.emailEnabled &&
                            settingsData.emailSystemAnnouncements
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange("emailSystemAnnouncements", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          className={
                            !settingsData.emailEnabled ? "text-chess-text-light/40" : ""
                          }
                        >
                          {t("Marketing Emails")}
                        </Label>
                        <Switch
                          disabled={!settingsData.emailEnabled}
                          checked={
                            settingsData.emailEnabled &&
                            settingsData.emailMarketingEmails
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange("emailMarketingEmails", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Push Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Push Notifications")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSettings ? (
                  <div className="flex justify-center items-center h-40">
                    <RefreshCw className="h-8 w-8 animate-spin text-chess-accent" />
                  </div>
                ) : !settingsData ? (
                  <div className="flex flex-col items-center justify-center py-8 text-chess-text-light/60">
                    <X className="h-12 w-12 mb-2 opacity-20" />
                    <h3 className="text-lg font-medium">{t("Settings unavailable")}</h3>
                    <p className="text-sm mt-1">{t("Could not load notification settings")}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => refetchSettings()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("Try Again")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{t("Enable Push Notifications")}</Label>
                      </div>
                      <Switch
                        checked={settingsData.pushEnabled}
                        onCheckedChange={(checked) =>
                          handleSettingChange("pushEnabled", checked)
                        }
                      />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label
                          className={
                            !settingsData.pushEnabled ? "text-chess-text-light/40" : ""
                          }
                        >
                          {t("Your Turn")}
                        </Label>
                        <Switch
                          disabled={!settingsData.pushEnabled}
                          checked={
                            settingsData.pushEnabled && settingsData.pushYourTurn
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange("pushYourTurn", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          className={
                            !settingsData.pushEnabled ? "text-chess-text-light/40" : ""
                          }
                        >
                          {t("Friend Activity")}
                        </Label>
                        <Switch
                          disabled={!settingsData.pushEnabled}
                          checked={
                            settingsData.pushEnabled &&
                            settingsData.pushFriendActivity
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange("pushFriendActivity", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          className={
                            !settingsData.pushEnabled ? "text-chess-text-light/40" : ""
                          }
                        >
                          {t("System Announcements")}
                        </Label>
                        <Switch
                          disabled={!settingsData.pushEnabled}
                          checked={
                            settingsData.pushEnabled &&
                            settingsData.pushSystemAnnouncements
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange("pushSystemAnnouncements", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* In-App Notification Settings */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t("In-App Notifications")}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingSettings ? (
                  <div className="flex justify-center items-center h-40">
                    <RefreshCw className="h-8 w-8 animate-spin text-chess-accent" />
                  </div>
                ) : !settingsData ? (
                  <div className="flex flex-col items-center justify-center py-8 text-chess-text-light/60">
                    <X className="h-12 w-12 mb-2 opacity-20" />
                    <h3 className="text-lg font-medium">{t("Settings unavailable")}</h3>
                    <p className="text-sm mt-1">{t("Could not load notification settings")}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => refetchSettings()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {t("Try Again")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{t("Enable In-App Notifications")}</Label>
                      </div>
                      <Switch
                        checked={settingsData.inAppEnabled}
                        onCheckedChange={(checked) =>
                          handleSettingChange("inAppEnabled", checked)
                        }
                      />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label
                          className={
                            !settingsData.inAppEnabled ? "text-chess-text-light/40" : ""
                          }
                        >
                          {t("Game Invites")}
                        </Label>
                        <Switch
                          disabled={!settingsData.inAppEnabled}
                          checked={
                            settingsData.inAppEnabled && settingsData.inAppGameInvites
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange("inAppGameInvites", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          className={
                            !settingsData.inAppEnabled ? "text-chess-text-light/40" : ""
                          }
                        >
                          {t("Tournament Updates")}
                        </Label>
                        <Switch
                          disabled={!settingsData.inAppEnabled}
                          checked={
                            settingsData.inAppEnabled &&
                            settingsData.inAppTournamentUpdates
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange("inAppTournamentUpdates", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          className={
                            !settingsData.inAppEnabled ? "text-chess-text-light/40" : ""
                          }
                        >
                          {t("System Announcements")}
                        </Label>
                        <Switch
                          disabled={!settingsData.inAppEnabled}
                          checked={
                            settingsData.inAppEnabled &&
                            settingsData.inAppSystemAnnouncements
                          }
                          onCheckedChange={(checked) =>
                            handleSettingChange("inAppSystemAnnouncements", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="md:col-span-2 flex justify-center">
              <Button
                onClick={() => refetchSettings()}
                disabled={isLoadingSettings}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingSettings ? "animate-spin" : ""}`} />
                {t("Refresh Settings")}
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Notifications;
