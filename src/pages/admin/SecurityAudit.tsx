
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  ShieldX,
  FileLock,
  History,
  FileSearch,
  RefreshCw,
  Search,
  Download,
  Calendar,
  User,
  Activity,
  Bookmark,
  XCircle,
  ChevronDown,
  ChevronUp,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Types for security and audit logs
interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: string;
  category: "auth" | "user" | "content" | "system" | "admin";
  severity: "info" | "warning" | "critical";
  status: "success" | "failure";
}

interface SecurityEvent {
  id: string;
  event: string;
  source: string;
  timestamp: string;
  ipAddress: string;
  details: string;
  category: "access" | "authentication" | "data" | "system";
  severity: "low" | "medium" | "high" | "critical";
  resolved: boolean;
}

interface LogFilters {
  startDate?: Date;
  endDate?: Date;
  searchTerm: string;
  category: string;
  severity: string;
  status?: string;
  userId?: string;
}

const SecurityAudit: React.FC = () => {
  const { t } = useLanguageContext();
  
  // State for security and audit logs
  const [activeTab, setActiveTab] = useState<"audit" | "security">("audit");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [filters, setFilters] = useState<LogFilters>({
    searchTerm: "",
    category: "all",
    severity: "all",
    status: "all"
  });
  
  // Query for fetching audit logs
  const { 
    data: auditLogs = [], 
    isLoading: isLoadingAuditLogs,
    refetch: refetchAuditLogs 
  } = useQuery({
    queryKey: ["audit-logs", filters],
    queryFn: async () => {
      // TODO: Replace with actual API call to fetch audit logs
      console.log("Fetching audit logs with filters:", filters);
      
      // Mock data for demonstration
      return [
        {
          id: "1",
          action: "User Login",
          userId: "user123",
          userName: "John Smith",
          userEmail: "john@example.com",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          details: "Successful login via password",
          category: "auth",
          severity: "info",
          status: "success"
        },
        {
          id: "2",
          action: "Password Reset",
          userId: "user456",
          userName: "Jane Doe",
          userEmail: "jane@example.com",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          ipAddress: "192.168.1.2",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
          details: "Password reset requested",
          category: "auth",
          severity: "info",
          status: "success"
        },
        {
          id: "3",
          action: "Failed Login Attempt",
          userId: "user789",
          userName: "Mike Johnson",
          userEmail: "mike@example.com",
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          ipAddress: "192.168.1.3",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          details: "Failed login attempt - incorrect password (3rd attempt)",
          category: "auth",
          severity: "warning",
          status: "failure"
        },
        {
          id: "4",
          action: "User Account Updated",
          userId: "user123",
          userName: "John Smith",
          userEmail: "john@example.com",
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          details: "User updated profile information",
          category: "user",
          severity: "info",
          status: "success"
        },
        {
          id: "5",
          action: "Content Deleted",
          userId: "admin1",
          userName: "Admin User",
          userEmail: "admin@example.com",
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
          ipAddress: "192.168.1.4",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          details: "Course content deleted - ID: course123",
          category: "content",
          severity: "warning",
          status: "success"
        },
        {
          id: "6",
          action: "System Update",
          userId: "system",
          userName: "System",
          userEmail: "system@example.com",
          timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
          ipAddress: "internal",
          userAgent: "System/1.0",
          details: "Scheduled system maintenance and updates applied",
          category: "system",
          severity: "info",
          status: "success"
        },
      ] as AuditLog[];
    }
  });
  
  // Query for fetching security events
  const { 
    data: securityEvents = [], 
    isLoading: isLoadingSecurityEvents,
    refetch: refetchSecurityEvents 
  } = useQuery({
    queryKey: ["security-events", filters],
    queryFn: async () => {
      // TODO: Replace with actual API call to fetch security events
      console.log("Fetching security events with filters:", filters);
      
      // Mock data for demonstration
      return [
        {
          id: "1",
          event: "Suspicious Login Attempt",
          source: "Auth Service",
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          ipAddress: "203.0.113.42",
          details: "Multiple failed login attempts from unusual location",
          category: "authentication",
          severity: "high",
          resolved: false
        },
        {
          id: "2",
          event: "API Rate Limit Exceeded",
          source: "API Gateway",
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
          ipAddress: "198.51.100.73",
          details: "User exceeded API rate limits by 300%",
          category: "access",
          severity: "medium",
          resolved: true
        },
        {
          id: "3",
          event: "Unauthorized Access Attempt",
          source: "Content Management System",
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
          ipAddress: "192.0.2.128",
          details: "Attempt to access restricted admin area without permissions",
          category: "access",
          severity: "high",
          resolved: true
        },
        {
          id: "4",
          event: "Database Connection Failure",
          source: "Database Service",
          timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(), // 2.5 hours ago
          ipAddress: "internal",
          details: "Temporary connection failure to primary database",
          category: "system",
          severity: "critical",
          resolved: true
        },
        {
          id: "5",
          event: "Data Export",
          source: "User Management",
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
          ipAddress: "192.168.1.4",
          details: "Admin exported user data containing PII",
          category: "data",
          severity: "medium",
          resolved: true
        }
      ] as SecurityEvent[];
    }
  });
  
  // Handle downloading logs
  const handleDownloadLogs = (type: "audit" | "security") => {
    // TODO: Implement log download functionality
    console.log(`Downloading ${type} logs with filters:`, filters);
    
    // Mock download
    const timestamp = format(new Date(), "yyyy-MM-dd");
    const filename = `${type}-logs-${timestamp}.csv`;
    
    // In a real implementation, you would generate a CSV file and download it
    // For demonstration, we'll just show a success message
    alert(`Downloading ${filename}. In a real implementation, this would download the logs as a CSV file.`);
  };
  
  // Apply all filters to the logs
  const filteredAuditLogs = auditLogs.filter(log => {
    // Search term filter
    if (filters.searchTerm && !log.action.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !log.userName.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !log.details.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category !== "all" && log.category !== filters.category) {
      return false;
    }
    
    // Severity filter
    if (filters.severity !== "all" && log.severity !== filters.severity) {
      return false;
    }
    
    // Status filter
    if (filters.status !== "all" && log.status !== filters.status) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate && new Date(log.timestamp) < filters.startDate) {
      return false;
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(log.timestamp) > endDate) {
        return false;
      }
    }
    
    return true;
  });
  
  // Apply all filters to security events
  const filteredSecurityEvents = securityEvents.filter(event => {
    // Search term filter
    if (filters.searchTerm && !event.event.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !event.details.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category !== "all" && event.category !== filters.category) {
      return false;
    }
    
    // Severity filter
    if (filters.severity !== "all" && event.severity !== filters.severity) {
      return false;
    }
    
    // Date range filter
    if (filters.startDate && new Date(event.timestamp) < filters.startDate) {
      return false;
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (new Date(event.timestamp) > endDate) {
        return false;
      }
    }
    
    return true;
  });
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy HH:mm:ss");
  };
  
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
    }
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
          <h1 className="text-2xl font-bold text-chess-text-light">{t("Security & Audit Logs")}</h1>
          <p className="text-sm text-chess-text-light/70 mt-1">
            {t("Monitor security events and user activity across the platform")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => activeTab === "audit" ? refetchAuditLogs() : refetchSecurityEvents()}
            disabled={activeTab === "audit" ? isLoadingAuditLogs : isLoadingSecurityEvents}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(activeTab === "audit" ? isLoadingAuditLogs : isLoadingSecurityEvents) ? "animate-spin" : ""}`} />
            {t("Refresh")}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleDownloadLogs(activeTab)}
          >
            <Download className="h-4 w-4 mr-2" />
            {t("Export")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <div className="flex flex-col space-y-4">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="audit" className="flex-1 md:flex-none">
              <History className="h-4 w-4 mr-2" />
              {t("Audit Logs")}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 md:flex-none">
              <ShieldX className="h-4 w-4 mr-2" />
              {t("Security Events")}
            </TabsTrigger>
          </TabsList>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder={t("Search logs...")}
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                    className="pl-8 w-full"
                  />
                  {filters.searchTerm && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setFilters({...filters, searchTerm: ""})}
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex gap-1 h-10">
                        <Calendar className="h-4 w-4" />
                        {filters.startDate && filters.endDate ? (
                          <span>
                            {format(filters.startDate, "MMM d")} - {format(filters.endDate, "MMM d")}
                          </span>
                        ) : filters.startDate ? (
                          <span>
                            {format(filters.startDate, "MMM d")} - 
                          </span>
                        ) : (
                          <span>{t("Date Range")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="flex">
                        <div className="p-2 border-r">
                          <h4 className="text-sm font-medium mb-2">{t("Start Date")}</h4>
                          <CalendarComponent
                            mode="single"
                            selected={filters.startDate}
                            onSelect={(date) => setFilters({...filters, startDate: date || undefined})}
                            initialFocus
                          />
                        </div>
                        <div className="p-2">
                          <h4 className="text-sm font-medium mb-2">{t("End Date")}</h4>
                          <CalendarComponent
                            mode="single"
                            selected={filters.endDate}
                            onSelect={(date) => setFilters({...filters, endDate: date || undefined})}
                            initialFocus
                            disabled={(date) => 
                              filters.startDate ? date < filters.startDate : false
                            }
                          />
                        </div>
                      </div>
                      <div className="border-t p-2 flex justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFilters({...filters, startDate: undefined, endDate: undefined})}
                        >
                          {t("Clear")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            // Set to today
                            const today = new Date();
                            const startOfWeek = new Date();
                            startOfWeek.setDate(today.getDate() - 7);
                            setFilters({
                              ...filters, 
                              startDate: startOfWeek,
                              endDate: today
                            });
                          }}
                        >
                          {t("Last 7 days")}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({...filters, category: value})}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder={t("Category")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Categories")}</SelectItem>
                      {activeTab === "audit" ? (
                        <>
                          <SelectItem value="auth">{t("Authentication")}</SelectItem>
                          <SelectItem value="user">{t("User")}</SelectItem>
                          <SelectItem value="content">{t("Content")}</SelectItem>
                          <SelectItem value="system">{t("System")}</SelectItem>
                          <SelectItem value="admin">{t("Admin")}</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="access">{t("Access")}</SelectItem>
                          <SelectItem value="authentication">{t("Authentication")}</SelectItem>
                          <SelectItem value="data">{t("Data")}</SelectItem>
                          <SelectItem value="system">{t("System")}</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filters.severity}
                    onValueChange={(value) => setFilters({...filters, severity: value})}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder={t("Severity")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("All Levels")}</SelectItem>
                      {activeTab === "audit" ? (
                        <>
                          <SelectItem value="info">{t("Info")}</SelectItem>
                          <SelectItem value="warning">{t("Warning")}</SelectItem>
                          <SelectItem value="critical">{t("Critical")}</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="low">{t("Low")}</SelectItem>
                          <SelectItem value="medium">{t("Medium")}</SelectItem>
                          <SelectItem value="high">{t("High")}</SelectItem>
                          <SelectItem value="critical">{t("Critical")}</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  
                  {activeTab === "audit" && (
                    <Select
                      value={filters.status || "all"}
                      onValueChange={(value) => setFilters({...filters, status: value})}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder={t("Status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("All Status")}</SelectItem>
                        <SelectItem value="success">{t("Success")}</SelectItem>
                        <SelectItem value="failure">{t("Failure")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoadingAuditLogs ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-chess-accent" />
                </div>
              ) : filteredAuditLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-chess-text-light/60">
                  <History className="h-16 w-16 mb-4 opacity-20" />
                  <h3 className="text-xl font-medium">{t("No audit logs found")}</h3>
                  <p className="text-sm mt-1">{t("Try changing your filters or date range")}</p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">{t("Action")}</TableHead>
                        <TableHead>{t("User")}</TableHead>
                        <TableHead>{t("Timestamp")}</TableHead>
                        <TableHead className="w-[100px]">{t("Category")}</TableHead>
                        <TableHead className="w-[100px]">{t("Severity")}</TableHead>
                        <TableHead className="w-[100px]">{t("Status")}</TableHead>
                        <TableHead className="text-right">{t("Details")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredAuditLogs.map((log) => (
                          <motion.tr
                            key={log.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className={`border-b hover:bg-chess-accent/5 transition-colors ${expandedLog === log.id ? 'bg-chess-accent/5' : ''}`}
                          >
                            <TableCell className="font-medium">{log.action}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{log.userName}</span>
                                <span className="text-xs text-chess-text-light/70">{log.userEmail}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{formatDate(log.timestamp)}</span>
                                <span className="text-xs text-chess-text-light/70">{log.ipAddress}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{log.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  log.severity === "info" ? "secondary" : 
                                  log.severity === "warning" ? "default" : 
                                  "destructive"
                                }
                              >
                                {log.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={log.status === "success" ? "outline" : "destructive"}
                              >
                                {log.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                              >
                                {expandedLog === log.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            
                            {/* Expanded details row */}
                            {expandedLog === log.id && (
                              <tr>
                                <td colSpan={7} className="bg-chess-accent/5 p-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium mb-1">{t("Details")}</h4>
                                      <p className="text-sm">{log.details}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <div>
                                        <h4 className="font-medium">{t("User Agent")}</h4>
                                        <p className="text-xs font-mono bg-chess-dark/20 p-2 rounded overflow-x-auto">{log.userAgent}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">{t("User ID")}</h4>
                                        <p className="text-sm">{log.userId}</p>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {isLoadingSecurityEvents ? (
                <div className="flex justify-center items-center h-64">
                  <RefreshCw className="h-8 w-8 animate-spin text-chess-accent" />
                </div>
              ) : filteredSecurityEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-chess-text-light/60">
                  <Shield className="h-16 w-16 mb-4 opacity-20" />
                  <h3 className="text-xl font-medium">{t("No security events found")}</h3>
                  <p className="text-sm mt-1">{t("Try changing your filters or date range")}</p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">{t("Event")}</TableHead>
                        <TableHead>{t("Source")}</TableHead>
                        <TableHead>{t("Timestamp")}</TableHead>
                        <TableHead className="w-[100px]">{t("Category")}</TableHead>
                        <TableHead className="w-[100px]">{t("Severity")}</TableHead>
                        <TableHead className="w-[100px]">{t("Status")}</TableHead>
                        <TableHead className="text-right">{t("Details")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredSecurityEvents.map((event) => (
                          <motion.tr
                            key={event.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className={`border-b hover:bg-chess-accent/5 transition-colors ${expandedLog === event.id ? 'bg-chess-accent/5' : ''}`}
                          >
                            <TableCell className="font-medium">{event.event}</TableCell>
                            <TableCell>{event.source}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span>{formatDate(event.timestamp)}</span>
                                <span className="text-xs text-chess-text-light/70">{event.ipAddress}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{event.category}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  event.severity === "low" ? "secondary" : 
                                  event.severity === "medium" ? "outline" : 
                                  event.severity === "high" ? "default" : 
                                  "destructive"
                                }
                              >
                                {event.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={event.resolved ? "outline" : "destructive"}
                              >
                                {event.resolved ? t("Resolved") : t("Open")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedLog(expandedLog === event.id ? null : event.id)}
                              >
                                {expandedLog === event.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                            
                            {/* Expanded details row */}
                            {expandedLog === event.id && (
                              <tr>
                                <td colSpan={7} className="bg-chess-accent/5 p-4">
                                  <div className="grid grid-cols-1 gap-4">
                                    <div>
                                      <h4 className="font-medium mb-1">{t("Details")}</h4>
                                      <p className="text-sm">{event.details}</p>
                                    </div>
                                    {!event.resolved && (
                                      <div className="flex justify-end">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => {
                                            // TODO: Implement event resolution functionality
                                            console.log("Resolving security event:", event.id);
                                            // In a real implementation, this would call an API
                                            toast.success(t("Event marked as resolved"));
                                          }}
                                        >
                                          {t("Mark as Resolved")}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SecurityAudit;
