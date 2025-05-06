
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { 
  Save, RotateCcw, Download, Calendar, File, FileDown, AlertCircle,
  CheckCircle, Trash2, MoreHorizontal, Clock, FileArchive
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminApi } from "@/services/api/endpoints/adminApi";

// Mock backups data for demo
const mockBackups = [
  {
    id: "bkp-1234567890",
    createdAt: "2025-05-01T08:15:22Z",
    size: "128.5 MB",
    type: "full",
    status: "completed",
    description: "Scheduled weekly backup"
  },
  {
    id: "bkp-2345678901",
    createdAt: "2025-04-24T08:12:33Z",
    size: "125.3 MB",
    type: "full",
    status: "completed",
    description: "Scheduled weekly backup"
  },
  {
    id: "bkp-3456789012",
    createdAt: "2025-04-17T08:10:12Z",
    size: "122.1 MB",
    type: "full",
    status: "completed",
    description: "Scheduled weekly backup"
  },
  {
    id: "bkp-4567890123",
    createdAt: "2025-04-10T08:05:19Z",
    size: "120.8 MB", 
    type: "full",
    status: "completed",
    description: "Scheduled weekly backup"
  },
  {
    id: "bkp-5678901234",
    createdAt: "2025-04-01T12:30:45Z",
    size: "119.2 MB",
    type: "manual", 
    status: "completed", 
    description: "Pre-deployment backup"
  }
];

const BackupRestore = () => {
  const { t } = useLanguageContext();
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Query to fetch backups
  const { data: backups, isLoading, error, refetch } = useQuery({
    queryKey: ['backups'],
    queryFn: () => {
      // TODO: Replace with actual API call
      // return adminApi.getBackups();
      return new Promise(resolve => {
        setTimeout(() => resolve(mockBackups), 1000);
      });
    }
  });

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);
    
    try {
      // TODO: Call API to create backup
      // await adminApi.createBackup();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(t("Backup created successfully"));
      refetch();
    } catch (error) {
      toast.error(t("Failed to create backup"));
      console.error("Backup creation error:", error);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackupId) return;
    
    setIsRestoringBackup(true);
    
    try {
      // TODO: Call API to restore backup
      // await adminApi.restoreBackup(selectedBackupId);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success(t("System restored successfully"));
      setConfirmDialogOpen(false);
    } catch (error) {
      toast.error(t("Failed to restore system"));
      console.error("Restore error:", error);
    } finally {
      setIsRestoringBackup(false);
    }
  };

  const handleDownloadBackup = (backupId: string) => {
    toast.success(t("Backup download started"));
    // TODO: Implement backup download
  };

  const handleDeleteBackup = (backupId: string) => {
    toast.success(t("Backup deleted successfully"));
    // TODO: Implement backup deletion
    refetch();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
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
            {t("Manage system backups and restore functionality")}
          </p>
        </div>
        <Button 
          onClick={handleCreateBackup} 
          disabled={isCreatingBackup}
          className="flex gap-2 items-center"
        >
          {isCreatingBackup ? (
            <>
              <Save className="h-4 w-4 animate-pulse" />
              {t("Creating backup...")}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t("Create Backup")}
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("System Status")}</CardTitle>
          <CardDescription>{t("Current state of backup and restore systems")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-muted-foreground">{t("Last Backup")}</span>
              <span className="text-lg font-semibold">
                {backups && backups.length > 0 ? formatDate(backups[0].createdAt) : t("Never")}
              </span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-muted-foreground">{t("Backup Schedule")}</span>
              <span className="text-lg font-semibold">{t("Weekly")}</span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-muted-foreground">{t("Total Backups")}</span>
              <span className="text-lg font-semibold">{backups?.length || 0}</span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-muted-foreground">{t("Storage Used")}</span>
              <span className="text-lg font-semibold">615.9 MB</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("Available Backups")}</CardTitle>
          <CardDescription>
            {t("List of system backups that can be downloaded or restored")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Backup ID")}</TableHead>
                <TableHead>{t("Created At")}</TableHead>
                <TableHead>{t("Size")}</TableHead>
                <TableHead>{t("Type")}</TableHead>
                <TableHead>{t("Status")}</TableHead>
                <TableHead>{t("Description")}</TableHead>
                <TableHead className="text-right">{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <div className="h-12 w-full rounded animate-pulse bg-muted"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : !backups || backups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileArchive className="h-12 w-12 mb-2" />
                      <p className="text-lg font-medium">{t("No Backups Available")}</p>
                      <p className="text-sm">{t("Create your first backup to get started")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.id}</TableCell>
                    <TableCell>{formatDate(backup.createdAt)}</TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>
                      <Badge variant={backup.type === "manual" ? "outline" : "secondary"}>
                        {backup.type === "manual" ? t("Manual") : t("Scheduled")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {backup.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-500 mr-2" />
                        )}
                        <span>
                          {backup.status === "completed" ? t("Completed") : t("In Progress")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{backup.description}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <span className="sr-only">{t("Open menu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedBackupId(backup.id);
                              setConfirmDialogOpen(true);
                            }}
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            {t("Restore")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadBackup(backup.id)}>
                            <Download className="h-4 w-4 mr-2" />
                            {t("Download")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteBackup(backup.id)}>
                            <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                            <span className="text-destructive">{t("Delete")}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">{t("Confirm System Restore")}</DialogTitle>
            <DialogDescription>
              {t("You are about to restore the system from backup. This will replace all current data with the data from the selected backup.")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md bg-destructive/10 p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-destructive">
                    {t("Warning")}
                  </h3>
                  <div className="mt-2 text-sm text-destructive/90">
                    <p>{t("This action cannot be undone. All users will be disconnected and the system will be unavailable during the restore process.")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isRestoringBackup}
            >
              {t("Cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRestoreBackup}
              disabled={isRestoringBackup}
            >
              {isRestoringBackup ? t("Restoring...") : t("Yes, Restore System")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("Backup Configuration")}</CardTitle>
          <CardDescription>{t("Configure automatic backup schedules and retention policies")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("Backup Schedule")}</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="schedule-daily"
                    name="backup-schedule"
                    className="border-primary text-primary focus:ring-primary"
                  />
                  <label htmlFor="schedule-daily">{t("Daily")}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="schedule-weekly"
                    name="backup-schedule"
                    defaultChecked
                    className="border-primary text-primary focus:ring-primary"
                  />
                  <label htmlFor="schedule-weekly">{t("Weekly")}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="schedule-monthly"
                    name="backup-schedule"
                    className="border-primary text-primary focus:ring-primary"
                  />
                  <label htmlFor="schedule-monthly">{t("Monthly")}</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("Backup Retention")}</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="retention-5"
                    name="backup-retention"
                    className="border-primary text-primary focus:ring-primary"
                  />
                  <label htmlFor="retention-5">{t("Keep last 5 backups")}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="retention-10"
                    name="backup-retention"
                    defaultChecked
                    className="border-primary text-primary focus:ring-primary"
                  />
                  <label htmlFor="retention-10">{t("Keep last 10 backups")}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="retention-all"
                    name="backup-retention"
                    className="border-primary text-primary focus:ring-primary"
                  />
                  <label htmlFor="retention-all">{t("Keep all backups")}</label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>{t("Save Configuration")}</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BackupRestore;
