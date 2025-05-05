
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { notificationsApi } from "@/services/api/endpoints/notificationsApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Clock, Filter, LayoutGrid, MessageSquare, Plus, RefreshCw, Send, Settings, Trash2, User } from "lucide-react";
import { motion } from "framer-motion";

// Notification type definition
interface Notification {
  id: string;
  title: string;
  content: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
  target?: "all" | "admins" | "players" | "premium";
  sender?: string;
}

// Settings type definition
interface NotificationSettings {
  email: {
    enabled: boolean;
    gameInvites: boolean;
    tournamentUpdates: boolean;
    systemAnnouncements: boolean;
    marketingEmails: boolean;
  };
  push: {
    enabled: boolean;
    gameInvites: boolean;
    yourTurn: boolean;
    friendActivity: boolean;
    tournamentUpdates: boolean;
    systemAnnouncements: boolean;
  };
  inApp: {
    enabled: boolean;
    gameInvites: boolean;
    yourTurn: boolean;
    friendActivity: boolean;
    tournamentUpdates: boolean;
    systemAnnouncements: boolean;
  };
}

// Notification card component
const NotificationCard: React.FC<{
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}> = ({ notification, onMarkAsRead, onDelete }) => {
  const { t } = useLanguageContext();
  
  // Format the timestamp
  const formattedTime = formatDistanceToNow(new Date(notification.timestamp), {
    addSuffix: true,
  });
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.type) {
      case "success": return <Check className="h-5 w-5 text-green-500" />;
      case "warning": return <Clock className="h-5 w-5 text-amber-500" />;
      case "error": return <Bell className="h-5 w-5 text-red-500" />;
      default: return <MessageSquare className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={notification.read ? "opacity-80" : ""}>
        <CardHeader className="p-4 pb-1 flex flex-row justify-between items-start">
          <div className="flex gap-2 items-center">
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
            <div>
              <CardTitle className="text-base">{notification.title}</CardTitle>
              <div className="text-xs text-chess-text-light/60 mt-1">
                {formattedTime}
                {notification.sender && (
                  <span> • {notification.sender}</span>
                )}
              </div>
            </div>
          </div>
          <Badge variant={notification.type === "warning" ? "outline" : notification.type === "error" ? "destructive" : "default"} className="ml-auto">
            {notification.target || t(notification.type)}
          </Badge>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm">{notification.content}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAsRead}
            >
              <Check className="h-4 w-4 mr-1" />
              {t("Mark as read")}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t("Delete")}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Main Notifications component
const Notifications: React.FC = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [filter, setFilter] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useLanguageContext();
  
  // Form state for creating notifications
  const [newNotification, setNewNotification] = useState({
    title: "",
    content: "",
    type: "info",
    target: "all",
  });

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const response = await notificationsApi.getNotifications(page);
      return response.data || [];
    },
  });

  // Fetch notification settings
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["notificationSettings"],
    queryFn: async () => {
      const response = await notificationsApi.getNotificationSettings();
      return response.data || {};
    },
    enabled: activeTab === "settings",
  });

  // Mark notification as read
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(t("Notification marked as read"));
    },
    onError: (error) => {
      toast.error(`${t("Error")}: ${(error as any).message || t("Failed to mark notification as read")}`);
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(t("All notifications marked as read"));
    },
    onError: (error) => {
      toast.error(`${t("Error")}: ${(error as any).message || t("Failed to mark all notifications as read")}`);
    },
  });

  // Delete notification
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(t("Notification deleted"));
    },
    onError: (error) => {
      toast.error(`${t("Error")}: ${(error as any).message || t("Failed to delete notification")}`);
    },
  });

  // Update settings
  const updateSettingsMutation = useMutation({
    mutationFn: (updatedSettings: NotificationSettings) => 
      notificationsApi.updateNotificationSettings(updatedSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
      toast.success(t("Notification settings updated"));
    },
    onError: (error) => {
      toast.error(`${t("Error")}: ${(error as any).message || t("Failed to update settings")}`);
    },
  });

  // Create notification
  const createNotificationMutation = useMutation({
    mutationFn: (data: any) => notificationsApi.createAdminNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setIsCreateOpen(false);
      setNewNotification({
        title: "",
        content: "",
        type: "info",
        target: "all",
      });
      toast.success(t("Notification sent"));
    },
    onError: (error) => {
      toast.error(`${t("Error")}: ${(error as any).message || t("Failed to send notification")}`);
    },
  });

  // Filter notifications based on active tab and filter
  const filteredNotifications = notifications.filter((notification: Notification) => {
    if (activeTab === "unread" && notification.read) return false;
    if (filter !== "all" && notification.type !== filter) return false;
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
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                {t("Create Notification")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("Create New Notification")}</DialogTitle>
                <DialogDescription>
                  {t("Send a notification to users of the platform")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title">{t("Title")}</label>
                  <Input
                    id="title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    placeholder={t("Notification title")}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="content">{t("Content")}</label>
                  <Textarea
                    id="content"
                    value={newNotification.content}
                    onChange={(e) => setNewNotification({ ...newNotification, content: e.target.value })}
                    placeholder={t("Write your message here")}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="type">{t("Type")}</label>
                    <Select
                      value={newNotification.type}
                      onValueChange={(value: any) => setNewNotification({ ...newNotification, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">{t("Info")}</SelectItem>
                        <SelectItem value="success">{t("Success")}</SelectItem>
                        <SelectItem value="warning">{t("Warning")}</SelectItem>
                        <SelectItem value="error">{t("Error")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="target">{t("Recipients")}</label>
                    <Select
                      value={newNotification.target}
                      onValueChange={(value: any) => setNewNotification({ ...newNotification, target: value })}
                    >
                      <SelectTrigger>
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
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  {t("Cancel")}
                </Button>
                <Button 
                  onClick={() => createNotificationMutation.mutate(newNotification)}
                  disabled={!newNotification.title || !newNotification.content}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {t("Send Notification")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["notifications"] })}>
            <RefreshCw className="h-4 w-4 mr-1" />
            {t("Refresh")}
          </Button>
          
          {activeTab !== "settings" && (
            <Button variant="outline" onClick={() => markAllAsReadMutation.mutate()}>
              <Check className="h-4 w-4 mr-1" />
              {t("Mark All as Read")}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">{t("All")}</TabsTrigger>
            <TabsTrigger value="unread">{t("Unread")}</TabsTrigger>
            <TabsTrigger value="settings">{t("Settings")}</TabsTrigger>
          </TabsList>
          
          {activeTab !== "settings" && (
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("Filter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Types")}</SelectItem>
                <SelectItem value="info">{t("Info")}</SelectItem>
                <SelectItem value="success">{t("Success")}</SelectItem>
                <SelectItem value="warning">{t("Warning")}</SelectItem>
                <SelectItem value="error">{t("Error")}</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Notifications Tabs */}
        <TabsContent value="all" className="mt-0">
          <div className="grid gap-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <RefreshCw className="h-8 w-8 text-chess-text-light/50" />
                </motion.div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center p-8">
                <Bell className="h-12 w-12 mx-auto mb-2 text-chess-text-light/30" />
                <h3 className="text-lg font-medium">{t("No notifications")}</h3>
                <p className="text-sm text-chess-text-light/60 mt-1">
                  {t("You don't have any notifications at the moment")}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification: Notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsReadMutation.mutate(notification.id)}
                  onDelete={() => deleteNotificationMutation.mutate(notification.id)}
                />
              ))
            )}
            
            {/* Pagination */}
            {filteredNotifications.length > 0 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {t("Previous")}
                </Button>
                <div className="mx-4 flex items-center">
                  {t("Page")} {page}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={filteredNotifications.length < 10}
                >
                  {t("Next")}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          {/* Same as "all" tab but filtered for unread */}
          <div className="grid gap-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                  <RefreshCw className="h-8 w-8 text-chess-text-light/50" />
                </motion.div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center p-8">
                <Bell className="h-12 w-12 mx-auto mb-2 text-chess-text-light/30" />
                <h3 className="text-lg font-medium">{t("No unread notifications")}</h3>
                <p className="text-sm text-chess-text-light/60 mt-1">
                  {t("You've read all your notifications")}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification: Notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsReadMutation.mutate(notification.id)}
                  onDelete={() => deleteNotificationMutation.mutate(notification.id)}
                />
              ))
            )}
            
            {/* Pagination */}
            {filteredNotifications.length > 0 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {t("Previous")}
                </Button>
                <div className="mx-4 flex items-center">
                  {t("Page")} {page}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={filteredNotifications.length < 10}
                >
                  {t("Next")}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          {isLoadingSettings ? (
            <div className="flex justify-center p-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <RefreshCw className="h-8 w-8 text-chess-text-light/50" />
              </motion.div>
            </div>
          ) : settings ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-3 gap-6">
                {/* Email Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {t("Email Notifications")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="email-enabled">{t("Enable Email Notifications")}</label>
                      <input
                        type="checkbox"
                        id="email-enabled"
                        checked={settings.email.enabled}
                        onChange={(e) => {
                          const updated = {
                            ...settings,
                            email: {
                              ...settings.email,
                              enabled: e.target.checked
                            }
                          };
                          updateSettingsMutation.mutate(updated);
                        }}
                        className="toggle"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="email-game-invites">{t("Game Invites")}</label>
                        <input
                          type="checkbox"
                          id="email-game-invites"
                          checked={settings.email.gameInvites}
                          disabled={!settings.email.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              email: {
                                ...settings.email,
                                gameInvites: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="email-tournament">{t("Tournament Updates")}</label>
                        <input
                          type="checkbox"
                          id="email-tournament"
                          checked={settings.email.tournamentUpdates}
                          disabled={!settings.email.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              email: {
                                ...settings.email,
                                tournamentUpdates: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="email-system">{t("System Announcements")}</label>
                        <input
                          type="checkbox"
                          id="email-system"
                          checked={settings.email.systemAnnouncements}
                          disabled={!settings.email.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              email: {
                                ...settings.email,
                                systemAnnouncements: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="email-marketing">{t("Marketing Emails")}</label>
                        <input
                          type="checkbox"
                          id="email-marketing"
                          checked={settings.email.marketingEmails}
                          disabled={!settings.email.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              email: {
                                ...settings.email,
                                marketingEmails: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Push Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      {t("Push Notifications")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="push-enabled">{t("Enable Push Notifications")}</label>
                      <input
                        type="checkbox"
                        id="push-enabled"
                        checked={settings.push.enabled}
                        onChange={(e) => {
                          const updated = {
                            ...settings,
                            push: {
                              ...settings.push,
                              enabled: e.target.checked
                            }
                          };
                          updateSettingsMutation.mutate(updated);
                        }}
                        className="toggle"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="push-game-invites">{t("Game Invites")}</label>
                        <input
                          type="checkbox"
                          id="push-game-invites"
                          checked={settings.push.gameInvites}
                          disabled={!settings.push.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              push: {
                                ...settings.push,
                                gameInvites: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="push-your-turn">{t("Your Turn")}</label>
                        <input
                          type="checkbox"
                          id="push-your-turn"
                          checked={settings.push.yourTurn}
                          disabled={!settings.push.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              push: {
                                ...settings.push,
                                yourTurn: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="push-friend">{t("Friend Activity")}</label>
                        <input
                          type="checkbox"
                          id="push-friend"
                          checked={settings.push.friendActivity}
                          disabled={!settings.push.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              push: {
                                ...settings.push,
                                friendActivity: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="push-tournament">{t("Tournament Updates")}</label>
                        <input
                          type="checkbox"
                          id="push-tournament"
                          checked={settings.push.tournamentUpdates}
                          disabled={!settings.push.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              push: {
                                ...settings.push,
                                tournamentUpdates: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="push-system">{t("System Announcements")}</label>
                        <input
                          type="checkbox"
                          id="push-system"
                          checked={settings.push.systemAnnouncements}
                          disabled={!settings.push.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              push: {
                                ...settings.push,
                                systemAnnouncements: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* In-App Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LayoutGrid className="h-5 w-5" />
                      {t("In-App Notifications")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor="inapp-enabled">{t("Enable In-App Notifications")}</label>
                      <input
                        type="checkbox"
                        id="inapp-enabled"
                        checked={settings.inApp.enabled}
                        onChange={(e) => {
                          const updated = {
                            ...settings,
                            inApp: {
                              ...settings.inApp,
                              enabled: e.target.checked
                            }
                          };
                          updateSettingsMutation.mutate(updated);
                        }}
                        className="toggle"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="inapp-game-invites">{t("Game Invites")}</label>
                        <input
                          type="checkbox"
                          id="inapp-game-invites"
                          checked={settings.inApp.gameInvites}
                          disabled={!settings.inApp.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              inApp: {
                                ...settings.inApp,
                                gameInvites: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="inapp-your-turn">{t("Your Turn")}</label>
                        <input
                          type="checkbox"
                          id="inapp-your-turn"
                          checked={settings.inApp.yourTurn}
                          disabled={!settings.inApp.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              inApp: {
                                ...settings.inApp,
                                yourTurn: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="inapp-friend">{t("Friend Activity")}</label>
                        <input
                          type="checkbox"
                          id="inapp-friend"
                          checked={settings.inApp.friendActivity}
                          disabled={!settings.inApp.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              inApp: {
                                ...settings.inApp,
                                friendActivity: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="inapp-tournament">{t("Tournament Updates")}</label>
                        <input
                          type="checkbox"
                          id="inapp-tournament"
                          checked={settings.inApp.tournamentUpdates}
                          disabled={!settings.inApp.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              inApp: {
                                ...settings.inApp,
                                tournamentUpdates: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="inapp-system">{t("System Announcements")}</label>
                        <input
                          type="checkbox"
                          id="inapp-system"
                          checked={settings.inApp.systemAnnouncements}
                          disabled={!settings.inApp.enabled}
                          onChange={(e) => {
                            const updated = {
                              ...settings,
                              inApp: {
                                ...settings.inApp,
                                systemAnnouncements: e.target.checked
                              }
                            };
                            updateSettingsMutation.mutate(updated);
                          }}
                          className="toggle"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["notificationSettings"] })}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {t("Refresh Settings")}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center p-8">
              <Settings className="h-12 w-12 mx-auto mb-2 text-chess-text-light/30" />
              <h3 className="text-lg font-medium">{t("Settings unavailable")}</h3>
              <p className="text-sm text-chess-text-light/60 mt-1">
                {t("Could not load notification settings")}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["notificationSettings"] })}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                {t("Try Again")}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
