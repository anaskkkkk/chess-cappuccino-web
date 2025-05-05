
import React, { useState, useEffect } from 'react';
import { useLanguageContext } from '@/contexts/LanguageContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Lock, Shield, AlertTriangle, Check, Info, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import PageTransition from '@/components/common/PageTransition';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  username: string;
  action: string;
  category: 'authentication' | 'user' | 'content' | 'admin' | 'access' | 'data';
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityEvent {
  id: string;
  timestamp: Date;
  category: 'authentication' | 'user' | 'content' | 'admin' | 'access' | 'data';
  event: string;
  details: string;
  ipAddress: string;
  userId: string | null;
  username: string | null;
  status: 'open' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

// Mock data for audit logs
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: new Date(),
    userId: 'user123',
    username: 'admin',
    action: 'User Login',
    category: 'authentication',
    details: 'Successful login',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success',
    severity: 'low',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 60000),
    userId: 'user456',
    username: 'john_doe',
    action: 'Profile Update',
    category: 'user',
    details: 'Changed email address',
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
    status: 'success',
    severity: 'low',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 120000),
    userId: 'user789',
    username: 'jane_smith',
    action: 'Failed Login',
    category: 'authentication',
    details: 'Invalid password provided',
    ipAddress: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS)',
    status: 'failure',
    severity: 'medium',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 180000),
    userId: 'admin001',
    username: 'super_admin',
    action: 'Role Updated',
    category: 'admin',
    details: 'Changed user permissions',
    ipAddress: '192.168.1.4',
    userAgent: 'Mozilla/5.0 (Linux; Android)',
    status: 'success',
    severity: 'high',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 240000),
    userId: 'user123',
    username: 'admin',
    action: 'Content Published',
    category: 'content',
    details: 'Published new course',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    status: 'success',
    severity: 'low',
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 300000),
    userId: 'user456',
    username: 'john_doe',
    action: 'API Access',
    category: 'access',
    details: 'Accessed restricted API endpoint',
    ipAddress: '192.168.1.5',
    userAgent: 'PostmanRuntime/7.29.0',
    status: 'failure',
    severity: 'critical',
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 360000),
    userId: 'user789',
    username: 'jane_smith',
    action: 'Data Export',
    category: 'data',
    details: 'Exported user analytics',
    ipAddress: '192.168.1.6',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
    status: 'success',
    severity: 'medium',
  },
];

// Mock data for security events
const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    timestamp: new Date(),
    category: 'authentication',
    event: 'Multiple Failed Login Attempts',
    details: '5 failed login attempts for username "admin" within 10 minutes',
    ipAddress: '203.0.113.1',
    userId: null,
    username: 'admin',
    status: 'open',
    severity: 'high',
    source: 'Auth Service',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000),
    category: 'access',
    event: 'Unusual API Usage Pattern',
    details: 'High frequency of API calls detected from unusual location',
    ipAddress: '203.0.113.2',
    userId: 'user123',
    username: 'john_doe',
    status: 'resolved',
    severity: 'medium',
    source: 'API Gateway',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000),
    category: 'admin',
    event: 'Admin Privilege Escalation',
    details: 'User gained admin privileges through role modification',
    ipAddress: '203.0.113.3',
    userId: 'user456',
    username: 'jane_smith',
    status: 'open',
    severity: 'critical',
    source: 'User Management Service',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 86400000),
    category: 'data',
    event: 'Unusual Data Access Pattern',
    details: 'User accessed large volume of user records in short time',
    ipAddress: '203.0.113.4',
    userId: 'user789',
    username: 'robert_johnson',
    status: 'open',
    severity: 'high',
    source: 'Database Monitor',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 172800000),
    category: 'content',
    event: 'Suspicious Content Modification',
    details: 'Multiple course content modified by same user in short timeframe',
    ipAddress: '203.0.113.5',
    userId: 'user321',
    username: 'david_miller',
    status: 'resolved',
    severity: 'medium',
    source: 'Content Management System',
  },
];

const SecurityAudit: React.FC = () => {
  const { t, isRTL } = useLanguageContext();
  const { toast } = useToast();
  
  // State for audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [auditCategory, setAuditCategory] = useState<string>('all');
  const [auditSeverity, setAuditSeverity] = useState<string>('all');
  const [auditStatus, setAuditStatus] = useState<string>('all');
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [auditPage, setAuditPage] = useState<number>(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isLogDetailsOpen, setIsLogDetailsOpen] = useState<boolean>(false);
  
  // State for security events
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [eventCategory, setEventCategory] = useState<string>('all');
  const [eventSeverity, setEventSeverity] = useState<string>('all');
  const [eventStatus, setEventStatus] = useState<string>('all');
  const [eventSearch, setEventSearch] = useState<string>('');
  const [eventPage, setEventPage] = useState<number>(1);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState<boolean>(false);
  
  // Date range state
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const logsPerPage = 5;
  const eventsPerPage = 5;
  
  // Filter audit logs based on search, category, severity, status, and date
  const filteredAuditLogs = auditLogs.filter((log) => {
    // Search filter
    const searchMatch = 
      auditSearch === '' || 
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.username.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase());
    
    // Category filter
    const categoryMatch = 
      auditCategory === 'all' || 
      log.category === auditCategory;
    
    // Severity filter
    const severityMatch = 
      auditSeverity === 'all' || 
      log.severity === auditSeverity;
    
    // Status filter
    const statusMatch = 
      auditStatus === 'all' || 
      log.status === auditStatus;
    
    // Date range filter
    const dateMatch =
      (startDate === '' || new Date(log.timestamp) >= new Date(startDate)) &&
      (endDate === '' || new Date(log.timestamp) <= new Date(endDate));
    
    return searchMatch && categoryMatch && severityMatch && statusMatch && dateMatch;
  });
  
  // Filter security events based on search, category, severity, status, and date
  const filteredSecurityEvents = securityEvents.filter((event) => {
    // Search filter
    const searchMatch = 
      eventSearch === '' || 
      event.event.toLowerCase().includes(eventSearch.toLowerCase()) ||
      (event.username && event.username.toLowerCase().includes(eventSearch.toLowerCase())) ||
      event.details.toLowerCase().includes(eventSearch.toLowerCase());
    
    // Category filter
    const categoryMatch = 
      eventCategory === 'all' || 
      event.category === eventCategory;
    
    // Severity filter
    const severityMatch = 
      eventSeverity === 'all' || 
      event.severity === eventSeverity;
    
    // Status filter
    const statusMatch = 
      eventStatus === 'all' || 
      event.status === eventStatus;
    
    // Date range filter
    const dateMatch =
      (startDate === '' || new Date(event.timestamp) >= new Date(startDate)) &&
      (endDate === '' || new Date(event.timestamp) <= new Date(endDate));
    
    return searchMatch && categoryMatch && severityMatch && statusMatch && dateMatch;
  });
  
  // Pagination for audit logs
  const paginatedAuditLogs = filteredAuditLogs.slice(
    (auditPage - 1) * logsPerPage,
    auditPage * logsPerPage
  );
  
  // Pagination for security events
  const paginatedSecurityEvents = filteredSecurityEvents.slice(
    (eventPage - 1) * eventsPerPage,
    eventPage * eventsPerPage
  );
  
  // Total pages calculation
  const totalAuditPages = Math.ceil(filteredAuditLogs.length / logsPerPage);
  const totalEventPages = Math.ceil(filteredSecurityEvents.length / eventsPerPage);
  
  // View audit log details
  const viewLogDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsLogDetailsOpen(true);
  };
  
  // View security event details
  const viewEventDetails = (event: SecurityEvent) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };
  
  // Mark security event as resolved
  const markEventAsResolved = (eventId: string) => {
    setSecurityEvents(
      securityEvents.map((event) =>
        event.id === eventId ? { ...event, status: 'resolved' } : event
      )
    );
    setIsEventDetailsOpen(false);
    
    // Show success toast
    toast({
      title: t("Event marked as resolved"),
      description: `Event ID: ${eventId}`,
    });
  };
  
  // Clear filters
  const clearFilters = () => {
    setAuditCategory('all');
    setAuditSeverity('all');
    setAuditStatus('all');
    setAuditSearch('');
    setStartDate('');
    setEndDate('');
    setEventCategory('all');
    setEventSeverity('all');
    setEventStatus('all');
    setEventSearch('');
  };
  
  // Set date range for last 7 days
  const setLast7Days = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    setStartDate(startDate.toISOString().split('T')[0]);
    setEndDate(endDate.toISOString().split('T')[0]);
  };
  
  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">High</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Critical</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
      case 'failure':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Failure</Badge>;
      case 'open':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">Open</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication':
        return <Lock className="size-4 text-purple-600" />;
      case 'user':
        return <Info className="size-4 text-blue-600" />;
      case 'content':
        return <Info className="size-4 text-green-600" />;
      case 'admin':
        return <Shield className="size-4 text-orange-600" />;
      case 'access':
        return <AlertTriangle className="size-4 text-yellow-600" />;
      case 'data':
        return <AlertTriangle className="size-4 text-red-600" />;
      default:
        return <Info className="size-4" />;
    }
  };
  
  // TODO: API integration for fetching audit logs
  const fetchAuditLogs = () => {
    // This will be replaced with actual API call
    console.log('Fetching audit logs with filters:', { 
      category: auditCategory, 
      severity: auditSeverity,
      status: auditStatus,
      search: auditSearch,
      startDate,
      endDate
    });
  };
  
  // TODO: API integration for fetching security events
  const fetchSecurityEvents = () => {
    // This will be replaced with actual API call
    console.log('Fetching security events with filters:', { 
      category: eventCategory, 
      severity: eventSeverity,
      status: eventStatus,
      search: eventSearch,
      startDate,
      endDate
    });
  };
  
  // Apply filters when they change
  useEffect(() => {
    fetchAuditLogs();
  }, [auditCategory, auditSeverity, auditStatus, auditSearch, startDate, endDate]);
  
  useEffect(() => {
    fetchSecurityEvents();
  }, [eventCategory, eventSeverity, eventStatus, eventSearch, startDate, endDate]);
  
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("Security & Audit Logs")}</h1>
          <p className="text-muted-foreground">{t("Monitor security events and user activity across the platform")}</p>
        </div>
        
        <Tabs defaultValue="audit" className="space-y-4">
          <TabsList>
            <TabsTrigger value="audit">{t("Audit Logs")}</TabsTrigger>
            <TabsTrigger value="security">{t("Security Events")}</TabsTrigger>
          </TabsList>
          
          {/* Filter Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t("Filters")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="search">{t("Search")}</Label>
                  <Input
                    id="search"
                    placeholder={t("Search logs...")}
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="min-w-0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>{t("Date Range")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startDate" className="sr-only">{t("Start Date")}</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="min-w-0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="sr-only">{t("End Date")}</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="min-w-0"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">{t("Category")}</Label>
                  <Select value={auditCategory} onValueChange={setAuditCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder={t("All Categories")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">{t("All Categories")}</SelectItem>
                        <SelectItem value="authentication">{t("Authentication")}</SelectItem>
                        <SelectItem value="user">{t("User")}</SelectItem>
                        <SelectItem value="content">{t("Content")}</SelectItem>
                        <SelectItem value="admin">{t("Admin")}</SelectItem>
                        <SelectItem value="access">{t("Access")}</SelectItem>
                        <SelectItem value="data">{t("Data")}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="severity">{t("Severity")}</Label>
                  <Select value={auditSeverity} onValueChange={setAuditSeverity}>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder={t("All Levels")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">{t("All Levels")}</SelectItem>
                        <SelectItem value="low">{t("Low")}</SelectItem>
                        <SelectItem value="medium">{t("Medium")}</SelectItem>
                        <SelectItem value="high">{t("High")}</SelectItem>
                        <SelectItem value="critical">{t("Critical")}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">{t("Status")}</Label>
                  <Select value={auditStatus} onValueChange={setAuditStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder={t("All Status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">{t("All Status")}</SelectItem>
                        <SelectItem value="success">{t("Success")}</SelectItem>
                        <SelectItem value="failure">{t("Failure")}</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 flex items-end">
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={clearFilters}>
                      {t("Clear")}
                    </Button>
                    <Button variant="outline" onClick={setLast7Days}>
                      {t("Last 7 days")}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Timestamp")}</TableHead>
                      <TableHead>{t("User")}</TableHead>
                      <TableHead>{t("Action")}</TableHead>
                      <TableHead className="hidden md:table-cell">{t("Category")}</TableHead>
                      <TableHead className="hidden md:table-cell">{t("Status")}</TableHead>
                      <TableHead className="hidden lg:table-cell">{t("Severity")}</TableHead>
                      <TableHead>{t("Details")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAuditLogs.length > 0 ? (
                      paginatedAuditLogs.map((log) => (
                        <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50" onClick={() => viewLogDetails(log)}>
                          <TableCell className="font-mono text-xs">
                            {format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                          </TableCell>
                          <TableCell>{log.username}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              {getCategoryIcon(log.category)}
                              <span className="ml-2">{log.category}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{getStatusBadge(log.status)}</TableCell>
                          <TableCell className="hidden lg:table-cell">{getSeverityBadge(log.severity)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              viewLogDetails(log);
                            }}>
                              {t("View")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <p className="text-muted-foreground">{t("No audit logs found")}</p>
                            <p className="text-sm text-muted-foreground">
                              {t("Try changing your filters or date range")}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                
                {totalAuditPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setAuditPage(Math.max(1, auditPage - 1))}
                          aria-disabled={auditPage === 1}
                          className={auditPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalAuditPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setAuditPage(i + 1)}
                            isActive={auditPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setAuditPage(Math.min(totalAuditPages, auditPage + 1))}
                          aria-disabled={auditPage === totalAuditPages}
                          className={auditPage === totalAuditPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Events Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Timestamp")}</TableHead>
                      <TableHead>{t("Event")}</TableHead>
                      <TableHead className="hidden md:table-cell">{t("Category")}</TableHead>
                      <TableHead className="hidden md:table-cell">{t("Status")}</TableHead>
                      <TableHead className="hidden lg:table-cell">{t("Severity")}</TableHead>
                      <TableHead>{t("Details")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSecurityEvents.length > 0 ? (
                      paginatedSecurityEvents.map((event) => (
                        <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50" onClick={() => viewEventDetails(event)}>
                          <TableCell className="font-mono text-xs">
                            {format(new Date(event.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                          </TableCell>
                          <TableCell>{event.event}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center">
                              {getCategoryIcon(event.category)}
                              <span className="ml-2">{event.category}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{getStatusBadge(event.status)}</TableCell>
                          <TableCell className="hidden lg:table-cell">{getSeverityBadge(event.severity)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={(e) => {
                              e.stopPropagation();
                              viewEventDetails(event);
                            }}>
                              {t("View")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <p className="text-muted-foreground">{t("No security events found")}</p>
                            <p className="text-sm text-muted-foreground">
                              {t("Try changing your filters or date range")}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                
                {totalEventPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setEventPage(Math.max(1, eventPage - 1))}
                          aria-disabled={eventPage === 1}
                          className={eventPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalEventPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setEventPage(i + 1)}
                            isActive={eventPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setEventPage(Math.min(totalEventPages, eventPage + 1))}
                          aria-disabled={eventPage === totalEventPages}
                          className={eventPage === totalEventPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Audit Log Details Dialog */}
        <Dialog open={isLogDetailsOpen} onOpenChange={setIsLogDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("Audit Log Details")}</DialogTitle>
              <DialogDescription>
                {selectedLog && format(new Date(selectedLog.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <ScrollArea className="max-h-[400px] mt-4">
                <div className="space-y-4 p-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("User ID")}</h4>
                      <p className="mt-1">{selectedLog.userId}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("Username")}</h4>
                      <p className="mt-1">{selectedLog.username}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">{t("Action")}</h4>
                    <p className="mt-1">{selectedLog.action}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("Category")}</h4>
                      <div className="mt-1 flex items-center">
                        {getCategoryIcon(selectedLog.category)}
                        <span className="ml-2">{selectedLog.category}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("Status")}</h4>
                      <div className="mt-1">{getStatusBadge(selectedLog.status)}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("Severity")}</h4>
                      <div className="mt-1">{getSeverityBadge(selectedLog.severity)}</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">{t("Details")}</h4>
                    <p className="mt-1 text-sm">{selectedLog.details}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("IP Address")}</h4>
                      <p className="mt-1 font-mono text-sm">{selectedLog.ipAddress}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("Timestamp")}</h4>
                      <p className="mt-1 font-mono text-sm">
                        {format(new Date(selectedLog.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">{t("User Agent")}</h4>
                    <p className="mt-1 text-xs font-mono break-all">{selectedLog.userAgent}</p>
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Security Event Details Dialog */}
        <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t("Security Event Details")}</DialogTitle>
              <DialogDescription>
                {selectedEvent && format(new Date(selectedEvent.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <ScrollArea className="max-h-[400px] mt-4">
                <div className="space-y-4 p-2">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">{t("Event")}</h4>
                    <p className="mt-1">{selectedEvent.event}</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("Category")}</h4>
                      <div className="mt-1 flex items-center">
                        {getCategoryIcon(selectedEvent.category)}
                        <span className="ml-2">{selectedEvent.category}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("Status")}</h4>
                      <div className="mt-1">{getStatusBadge(selectedEvent.status)}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("Severity")}</h4>
                      <div className="mt-1">{getSeverityBadge(selectedEvent.severity)}</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">{t("Details")}</h4>
                    <p className="mt-1 text-sm">{selectedEvent.details}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
                    {selectedEvent.userId && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">{t("User ID")}</h4>
                        <p className="mt-1">{selectedEvent.userId}</p>
                      </div>
                    )}
                    {selectedEvent.username && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">{t("Username")}</h4>
                        <p className="mt-1">{selectedEvent.username}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("IP Address")}</h4>
                      <p className="mt-1 font-mono text-sm">{selectedEvent.ipAddress}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">{t("Source")}</h4>
                      <p className="mt-1">{selectedEvent.source}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end">
                    {selectedEvent.status === 'open' && (
                      <Button 
                        onClick={() => markEventAsResolved(selectedEvent.id)}
                        className="flex items-center"
                      >
                        <Check className="size-4 mr-2" />
                        {t("Mark as Resolved")}
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default SecurityAudit;
