import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Database,
  Save,
  UploadCloud,
  Download,
  Trash2,
  RefreshCw,
  Settings,
  Calendar,
  HardDrive,
  Clock,
  AlertTriangle,
  CheckCircle,
  File,
  BarChart,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { adminApi } from "@/services/api/endpoints/adminApi";

// Types for backups
interface Backup {
  id: string;
  name: string;
  size: string;
  date: string;
  status: "completed" | "in_progress" | "failed";
  type: "manual" | "scheduled" | "automatic";
  contents: {
    database: boolean;
    files: boolean;
    settings: boolean;
  };
}

interface BackupConfig {
  automaticBackups: boolean;
  frequency: "daily" | "weekly" | "monthly";
  timeOfDay: string;
  retention: number;
  includeDatabases: boolean;
  includeFiles: boolean;
  includeSettings: boolean;
  storageLocation: "local" | "cloud";
  compression: boolean;
}

// Mock data for backups
const mockBackups: Backup[] = [
  {
    id: "backup-001",
    name: "Daily Backup",
    size: "124.5 MB",
    date: "2025-05-05T03:00:00Z",
    status: "completed",
    type: "scheduled",
    contents: { database: true, files: true, settings: true }
  },
  {
    id: "backup-002",
    name: "Pre-Update Backup",
    size: "132.8 MB",
    date: "2025-05-03T14:30:15Z",
    status: "completed",
    type: "manual",
    contents: { database: true, files: true, settings: true }
  },
  {
    id: "backup-003",
    name: "Weekly Backup",
    size: "118.2 MB",
    date: "2025-04-28T03:00:00Z",
    status: "completed",
    type: "scheduled",
    contents: { database: true, files: false, settings: true }
  },
  {
    id: "backup-004",
    name: "Database Only",
    size: "85.1 MB",
    date: "2025-04-25T18:45:22Z",
    status: "completed",
    type: "manual",
    contents: { database: true, files: false, settings: false }
  },
  {
    id: "backup-005",
    name: "Current Backup",
    size: "136.5 MB",
    date: "2025-05-06T03:00:00Z", 
    status: "in_progress",
    type: "automatic",
    contents: { database: true, files: true, settings: true }
  },
  {
    id: "backup-006",
    name: "Failed Backup",
    size: "0 MB",
    date: "2025-05-04T03:00:00Z",
    status: "failed",
    type: "scheduled",
    contents: { database: true, files: true, settings: true }
  }
];

// Mock data for backup config
const mockBackupConfig: BackupConfig = {
  automaticBackups: true,
  frequency: "daily",
  timeOfDay: "03:00",
  retention: 14,
  includeDatabases: true,
  includeFiles: true,
  includeSettings: true,
  storageLocation: "cloud",
  compression: true
};

const BackupRestore = () => {
  const { t } = useLanguageContext();
  const queryClient = useQueryClient();
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  
  // Queries
  const { data: backups, isLoading: isLoadingBackups } = useQuery<Backup[]>({
    queryKey: ['backups'],
    queryFn: () => {
      // TODO: Replace with actual API call
      // return adminApi.getBackups();
      return Promise.resolve(mockBackups);
    }
  });
  
  const { data: backupConfig, isLoading: isLoadingConfig } = useQuery<BackupConfig>({
    queryKey: ['backupConfig'],
    queryFn: () => {
      // TODO: Replace with actual API call
      // This would normally come from your API
      return Promise.resolve(mockBackupConfig);
    }
  });
  
  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async () => {
      // Simulate backup progress
      setBackupInProgress(true);
      setBackupProgress(0);
      
      // Simulate progress updates
      const interval = setInterval(() => {
        setBackupProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 10);
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 500);
      
      // TODO: Replace with actual API call
      // return adminApi.createBackup();
      return new Promise((resolve) => {
        setTimeout(() => {
          setBackupInProgress(false);
          setBackupProgress(0);
          clearInterval(interval);
          resolve({ success: true });
        }, 5000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
      toast.success(t("Backup created successfully"));
    },
    onError: () => {
      setBackupInProgress(false);
      setBackupProgress(0);
      toast.error(t("Failed to create backup"));
    }
  });
  
  // Delete backup mutation
  const deleteBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      // TODO: Replace with actual API call
      // return adminApi.deleteBackup(backupId);
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] });
      toast.success(t("Backup deleted successfully"));
      setConfirmDeleteId(null);
    },
    onError: () => {
      toast.error(t("Failed to delete backup"));
      setConfirmDeleteId(null);
    }
  });
  
  // Restore backup mutation
  const restoreBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      // TODO: Replace with actual API call
      // return adminApi.restoreBackup(backupId);
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 3000);
      });
    },
    onSuccess: () => {
      toast.success(t("Backup restored successfully"));
      setConfirmRestoreId(null);
    },
    onError: () => {
      toast.error(t("Failed to restore backup"));
      setConfirmRestoreId(null);
    }
  });
  
  // Update backup config mutation
  const updateBackupConfigMutation = useMutation({
    mutationFn: async (config: BackupConfig) => {
      // TODO: Replace with actual API call
      // return adminApi.updateBackupConfig(config);
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backupConfig'] });
      toast.success(t("Backup settings updated"));
    },
    onError: () => {
      toast.error(t("Failed to update backup settings"));
    }
  });
  
  const handleCreateBackup = () => {
    createBackupMutation.mutate();
  };
  
  const handleDeleteBackup = (backupId: string) => {
    deleteBackupMutation.mutate(backupId);
  };
  
  const handleRestoreBackup = (backupId: string) => {
    restoreBackupMutation.mutate(backupId);
  };
  
  const handleUpdateConfig = (updatedConfig: Partial<BackupConfig>) => {
    if (!backupConfig) return;
    updateBackupConfigMutation.mutate({
      ...backupConfig,
      ...updatedConfig
    });
  };
  
  const formatBackupDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };
  
  const getBackupStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in_progress": return "secondary";
      case "failed": return "destructive";
      default: return "outline";
    }
  };
  
  const getBackupStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress": return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case "failed": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };
  
  const getBackupTypeLabel = (type: string) => {
    switch (type) {
      case "manual": return t("Manual");
      case "scheduled": return t("Scheduled");
      case "automatic": return t("Automatic");
      default: return type;
    }
  };
  
  // Calculate backup stats
  const backupStats = {
    total: backups?.length || 0,
    scheduled: backups?.filter(b => b.type === "scheduled").length || 0,
    manual: backups?.filter(b => b.type === "manual").length || 0,
    automatic: backups?.filter(b => b.type === "automatic").length || 0,
    successful: backups?.filter(b => b.status === "completed").length || 0,
    failed: backups?.filter(b => b.status === "failed").length || 0
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
          <h2 className="text-2xl font-bold tracking-tight">{t("Backup & Restore")}</h2>
          <p className="text-muted-foreground">
            {t("Manage system backups and restore points")}
          </p>
        </div>
        <Button 
          onClick={handleCreateBackup} 
          className="flex gap-2"
          disabled={backupInProgress || createBackupMutation.isPending}
        >
          <Save className="h-4 w-4" />
          {backupInProgress ? t("Backing Up...") : t("Create Backup")}
        </Button>
      </div>
      
      {backupInProgress && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("Creating backup...")}</span>
                <span className="text-sm font-medium">{backupProgress}%</span>
              </div>
              <Progress value={backupProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{t("Backup Status")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <Database className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{backupStats.successful}/{backupStats.total}</div>
                <div className="text-sm text-muted-foreground">{t("Successful backups")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{t("Next Scheduled Backup")}</CardTitle>
          </CardHeader>
          <CardContent>
            {backupConfig?.automaticBackups ? (
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{backupConfig.timeOfDay}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {backupConfig.frequency === "daily" ? t("Today") : 
                      backupConfig.frequency === "weekly" ? t("Next Sunday") : t("Next Month")}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-500/10 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <div className="text-lg font-medium">{t("Not Scheduled")}</div>
                  <div className="text-sm text-muted-foreground">
                    {t("Automatic backups are disabled")}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{t("Backup Storage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center">
                <HardDrive className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {backupConfig?.storageLocation === "cloud" ? t("Cloud") : t("Local")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {backupConfig?.compression ? t("Compressed") : t("Uncompressed")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="backups">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="backups">{t("Backup List")}</TabsTrigger>
          <TabsTrigger value="settings">{t("Backup Settings")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="backups" className="space-y-4">
          {isLoadingBackups ? (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center p-2 border-b">
                      <div className="space-y-2">
                        <div className="h-5 w-48 bg-muted animate-pulse rounded"></div>
                        <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                      </div>
                      <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">{t("Backup")}</TableHead>
                      <TableHead>{t("Type")}</TableHead>
                      <TableHead>{t("Size")}</TableHead>
                      <TableHead>{t("Date")}</TableHead>
                      <TableHead>{t("Status")}</TableHead>
                      <TableHead>{t("Contents")}</TableHead>
                      <TableHead className="text-right">{t("Actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups && backups.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Database className="h-12 w-12 mb-2" />
                            <p className="text-lg font-medium">{t("No Backups Found")}</p>
                            <p className="text-sm">{t("Create your first backup to get started")}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      backups && backups.map(backup => (
                        <TableRow key={backup.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{backup.name}</div>
                              <div className="text-xs text-muted-foreground">ID: {backup.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getBackupTypeLabel(backup.type)}
                            </Badge>
                          </TableCell>
                          <TableCell>{backup.size}</TableCell>
                          <TableCell>{formatBackupDate(backup.date)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getBackupStatusIcon(backup.status)}
                              <Badge variant={getBackupStatusColor(backup.status)}>
                                {t(backup.status === "completed" ? "Completed" : 
                                   backup.status === "in_progress" ? "In Progress" : "Failed")}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {backup.contents.database && (
                                <Badge variant="outline" className="text-xs">DB</Badge>
                              )}
                              {backup.contents.files && (
                                <Badge variant="outline" className="text-xs">Files</Badge>
                              )}
                              {backup.contents.settings && (
                                <Badge variant="outline" className="text-xs">Settings</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={backup.status !== "completed" || restoreBackupMutation.isPending}
                                onClick={() => setConfirmRestoreId(backup.id)}
                                title={t("Restore")}
                              >
                                <UploadCloud className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={backup.status !== "completed"}
                                title={t("Download")}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                disabled={deleteBackupMutation.isPending}
                                onClick={() => setConfirmDeleteId(backup.id)}
                                title={t("Delete")}
                                className="hover:bg-red-500/10 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t("Automatic Backup Settings")}</CardTitle>
              <CardDescription>{t("Configure when and how automatic backups are performed")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingConfig ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-5 w-48 bg-muted animate-pulse rounded"></div>
                      <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="automaticBackups" className="flex flex-col gap-1">
                      <span>{t("Enable Automatic Backups")}</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        {t("System will create backups according to the schedule")}
                      </span>
                    </Label>
                    <Switch
                      id="automaticBackups"
                      checked={backupConfig?.automaticBackups}
                      onCheckedChange={(checked) => handleUpdateConfig({ automaticBackups: checked })}
                      disabled={updateBackupConfigMutation.isPending}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="frequency" className="mb-2 block">{t("Backup Frequency")}</Label>
                        <Select
                          value={backupConfig?.frequency}
                          onValueChange={(value) => handleUpdateConfig({ frequency: value as "daily" | "weekly" | "monthly" })}
                          disabled={!backupConfig?.automaticBackups || updateBackupConfigMutation.isPending}
                        >
                          <SelectTrigger id="frequency">
                            <SelectValue placeholder={t("Select frequency")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">{t("Daily")}</SelectItem>
                            <SelectItem value="weekly">{t("Weekly")}</SelectItem>
                            <SelectItem value="monthly">{t("Monthly")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="timeOfDay" className="mb-2 block">{t("Time of Day")}</Label>
                        <Input
                          id="timeOfDay"
                          type="time"
                          value={backupConfig?.timeOfDay}
                          onChange={(e) => handleUpdateConfig({ timeOfDay: e.target.value })}
                          disabled={!backupConfig?.automaticBackups || updateBackupConfigMutation.isPending}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="retention" className="mb-2 block">{t("Retention Period (days)")}</Label>
                        <Input
                          id="retention"
                          type="number"
                          min={1}
                          max={365}
                          value={backupConfig?.retention}
                          onChange={(e) => handleUpdateConfig({ retention: parseInt(e.target.value) })}
                          disabled={!backupConfig?.automaticBackups || updateBackupConfigMutation.isPending}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-4">{t("Backup Contents")}</h3>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="includeDatabases">{t("Include Databases")}</Label>
                        <Switch
                          id="includeDatabases"
                          checked={backupConfig?.includeDatabases}
                          onCheckedChange={(checked) => handleUpdateConfig({ includeDatabases: checked })}
                          disabled={!backupConfig?.automaticBackups || updateBackupConfigMutation.isPending}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="includeFiles">{t("Include Files")}</Label>
                        <Switch
                          id="includeFiles"
                          checked={backupConfig?.includeFiles}
                          onCheckedChange={(checked) => handleUpdateConfig({ includeFiles: checked })}
                          disabled={!backupConfig?.automaticBackups || updateBackupConfigMutation.isPending}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="includeSettings">{t("Include Settings")}</Label>
                        <Switch
                          id="includeSettings"
                          checked={backupConfig?.includeSettings}
                          onCheckedChange={(checked) => handleUpdateConfig({ includeSettings: checked })}
                          disabled={!backupConfig?.automaticBackups || updateBackupConfigMutation.isPending}
                        />
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div>
                        <Label htmlFor="storageLocation" className="mb-2 block">{t("Storage Location")}</Label>
                        <Select
                          value={backupConfig?.storageLocation}
                          onValueChange={(value) => handleUpdateConfig({ storageLocation: value as "local" | "cloud" })}
                          disabled={!backupConfig?.automaticBackups || updateBackupConfigMutation.isPending}
                        >
                          <SelectTrigger id="storageLocation">
                            <SelectValue placeholder={t("Select location")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="local">{t("Local Storage")}</SelectItem>
                            <SelectItem value="cloud">{t("Cloud Storage")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="compression">{t("Enable Compression")}</Label>
                        <Switch
                          id="compression"
                          checked={backupConfig?.compression}
                          onCheckedChange={(checked) => handleUpdateConfig({ compression: checked })}
                          disabled={!backupConfig?.automaticBackups || updateBackupConfigMutation.isPending}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button 
                onClick={() => handleUpdateConfig(backupConfig!)} 
                disabled={updateBackupConfigMutation.isPending}
              >
                {updateBackupConfigMutation.isPending ? t("Saving...") : t("Save Settings")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={() => setConfirmDeleteId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("Confirm Deletion")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to delete this backup? This action cannot be undone.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDeleteId(null)}
              disabled={deleteBackupMutation.isPending}
            >
              {t("Cancel")}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => confirmDeleteId && handleDeleteBackup(confirmDeleteId)}
              disabled={deleteBackupMutation.isPending}
            >
              {deleteBackupMutation.isPending ? t("Deleting...") : t("Delete Backup")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Restore Dialog */}
      <Dialog open={!!confirmRestoreId} onOpenChange={() => setConfirmRestoreId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("Confirm Restoration")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to restore this backup? This will replace your current data.")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-500">
                  {t("Warning")}
                </h3>
              </div>
              <div className="ml-8 mt-2 text-sm text-amber-700 dark:text-amber-400">
                <p>{t("This will overwrite current data and cannot be undone.")}</p>
                <p className="mt-1">{t("The system will restart during this process.")}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmRestoreId(null)}
              disabled={restoreBackupMutation.isPending}
            >
              {t("Cancel")}
            </Button>
            <Button 
              variant="default" 
              onClick={() => confirmRestoreId && handleRestoreBackup(confirmRestoreId)}
              disabled={restoreBackupMutation.isPending}
            >
              {restoreBackupMutation.isPending ? t("Restoring...") : t("Restore Backup")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default BackupRestore;
