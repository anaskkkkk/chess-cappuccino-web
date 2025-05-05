
import React, { useState, useEffect } from 'react';
import { useLanguageContext } from '@/contexts/LanguageContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Activity, Server, Database, HardDrive, Wifi, BarChart, Settings, FileTerminal } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import PageTransition from '@/components/common/PageTransition';
import { useToast } from '@/hooks/use-toast';

interface ServiceStatus {
  id: string;
  name: string;
  uptime: string;
  responseTime: number;
  status: 'healthy' | 'warning' | 'critical' | 'unavailable';
}

interface SystemMetric {
  name: string;
  current: number;
  average: number;
  peak: number;
  unit: string;
}

interface Incident {
  id: string;
  timestamp: Date;
  service: string;
  description: string;
  status: 'resolved' | 'ongoing';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// Mock service status data
const mockServicesData: ServiceStatus[] = [
  { id: '1', name: 'Main API', uptime: '99.99%', responseTime: 120, status: 'healthy' },
  { id: '2', name: 'Database', uptime: '99.95%', responseTime: 85, status: 'healthy' },
  { id: '3', name: 'Storage', uptime: '99.90%', responseTime: 210, status: 'healthy' },
  { id: '4', name: 'Auth Service', uptime: '99.98%', responseTime: 145, status: 'healthy' },
  { id: '5', name: 'WebSocket', uptime: '99.85%', responseTime: 55, status: 'warning' },
  { id: '6', name: 'Search Service', uptime: '99.80%', responseTime: 320, status: 'warning' },
  { id: '7', name: 'Email Service', uptime: '99.75%', responseTime: 890, status: 'critical' },
  { id: '8', name: 'CDN', uptime: '99.99%', responseTime: 45, status: 'healthy' },
];

// Mock system metrics data
const mockMetricsData: SystemMetric[] = [
  { name: 'CPU Usage', current: 34, average: 28, peak: 87, unit: '%' },
  { name: 'Memory Usage', current: 62, average: 58, peak: 85, unit: '%' },
  { name: 'Disk Usage', current: 47, average: 45, peak: 50, unit: '%' },
  { name: 'Network In', current: 8.5, average: 7.2, peak: 28.6, unit: 'MB/s' },
  { name: 'Network Out', current: 3.2, average: 2.8, peak: 15.4, unit: 'MB/s' },
];

// Mock incidents data
const mockIncidentsData: Incident[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    service: 'Email Service',
    description: 'High latency in email sending due to third-party provider issues',
    status: 'ongoing',
    severity: 'medium',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    service: 'Database',
    description: 'Increased query response time due to index rebuilding',
    status: 'resolved',
    severity: 'low',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    service: 'API Gateway',
    description: 'Intermittent 503 errors due to network configuration issues',
    status: 'resolved',
    severity: 'high',
  },
];

const SystemHealth: React.FC = () => {
  const { t, isRTL } = useLanguageContext();
  const { toast } = useToast();
  
  // State for data
  const [services, setServices] = useState<ServiceStatus[]>(mockServicesData);
  const [metrics, setMetrics] = useState<SystemMetric[]>(mockMetricsData);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidentsData);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState<boolean>(false);
  
  // Categorized services
  const backendServices = services.filter(s => ['Main API', 'Auth Service', 'WebSocket', 'Search Service', 'Email Service'].includes(s.name));
  const infrastructureServices = services.filter(s => ['Database', 'Storage', 'CDN'].includes(s.name));
  
  // System status calculation
  const getSystemStatus = (): 'healthy' | 'degraded' | 'critical' | 'unknown' => {
    if (services.length === 0) return 'unknown';
    
    const criticalServices = services.filter(s => s.status === 'critical');
    const warningServices = services.filter(s => s.status === 'warning');
    const unavailableServices = services.filter(s => s.status === 'unavailable');
    
    if (criticalServices.length > 0 || unavailableServices.length > 0) return 'critical';
    if (warningServices.length > 0) return 'degraded';
    return 'healthy';
  };
  
  const systemStatus = getSystemStatus();
  
  // Helper to get status badge for services
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{t("Healthy")}</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">{t("Warning")}</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">{t("Critical")}</Badge>;
      case 'unavailable':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">{t("Unavailable")}</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{t("Resolved")}</Badge>;
      case 'ongoing':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">{t("Open")}</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">{t("Degraded")}</Badge>;
      default:
        return <Badge variant="outline">{t("Unknown")}</Badge>;
    }
  };
  
  // Helper to get severity badge for incidents
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{t("Low")}</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">{t("Medium")}</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">{t("High")}</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">{t("Critical")}</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };
  
  // Helper to get status icon for system status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Activity className="size-5 text-green-500" />;
      case 'degraded':
        return <Activity className="size-5 text-yellow-500" />;
      case 'critical':
        return <Activity className="size-5 text-red-500" />;
      default:
        return <Activity className="size-5 text-gray-500" />;
    }
  };
  
  // Helper to get progress bar color for metrics
  const getProgressColor = (value: number): string => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Function to refresh data
  const refreshData = () => {
    // In a real application, this would make API calls to get fresh data
    // For now, we'll just update the last updated timestamp
    setLastUpdated(new Date());
    
    // Mock API call
    console.log('Refreshing system health data...');
    
    toast({
      title: "Data refreshed",
      description: `Last updated: ${format(new Date(), 'HH:mm:ss')}`,
    });
  };
  
  // Function to run diagnostics
  const runDiagnostics = () => {
    setIsRunningDiagnostics(true);
    
    // In a real application, this would trigger a comprehensive system check
    // For now, we'll just simulate the process with a timeout
    console.log('Running system diagnostics...');
    
    toast({
      title: t("Running diagnostics..."),
      description: t("This may take a few moments"),
    });
    
    setTimeout(() => {
      setIsRunningDiagnostics(false);
      
      toast({
        title: t("Diagnostics completed"),
        description: t("All systems were checked for issues"),
      });
    }, 3000);
  };
  
  // TODO: API integration for fetching system health data
  const fetchSystemHealth = () => {
    // This will be replaced with actual API calls
    console.log('Fetching system health data from API...');
    // TODO: Call adminService.getSystemHealth() to fetch real data
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchSystemHealth();
    
    // In a real application, you might want to set up polling for regular updates
    const intervalId = setInterval(() => {
      fetchSystemHealth();
    }, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("System Health")}</h1>
          <p className="text-muted-foreground">
            {t("Monitor server status, resource usage, and system performance")}
          </p>
        </div>
        
        {/* System Status Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("System Status")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(systemStatus)}
                  <span className="ml-2 text-2xl font-bold">{t(systemStatus)}</span>
                </div>
                {getStatusBadge(systemStatus)}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                {t("Last Updated")}: {format(lastUpdated, 'HH:mm:ss')}
              </p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("Active Connections")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wifi className="size-5 text-blue-500" />
                  <span className="ml-2 text-2xl font-bold">1,248</span>
                </div>
                <span className="text-green-600 text-xs">+12%</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                24 {t("requests")}/s, 0 {t("errors")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("Database")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="size-5 text-purple-500" />
                  <span className="ml-2 text-2xl font-bold">{t("Healthy")}</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  85ms
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("Read")}: 452/s, {t("Write")}: 128/s
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{t("Storage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="size-5 text-orange-500" />
                  <span className="ml-2 text-2xl font-bold">53%</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("Free")}: 47%, {t("Used")}: 53%
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={refreshData} className="flex items-center gap-2">
            <Settings className="size-4" />
            {t("Refresh Data")}
          </Button>
          
          <Button 
            onClick={runDiagnostics} 
            disabled={isRunningDiagnostics}
            className="flex items-center gap-2"
          >
            <FileTerminal className="size-4" />
            {isRunningDiagnostics ? t("Running diagnostics...") : t("Run Diagnostics")}
          </Button>
        </div>
        
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services">{t("Services")}</TabsTrigger>
            <TabsTrigger value="resources">{t("Resources")}</TabsTrigger>
            <TabsTrigger value="incidents">{t("Incidents")}</TabsTrigger>
          </TabsList>
          
          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Backend Services")}</CardTitle>
                <CardDescription>
                  {t("Main application services status and response times")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Service")}</TableHead>
                      <TableHead className="hidden md:table-cell">{t("Uptime")}</TableHead>
                      <TableHead>{t("Response Time")}</TableHead>
                      <TableHead>{t("Status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backendServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{service.uptime}</TableCell>
                        <TableCell>
                          {service.responseTime}ms
                          {service.responseTime > 300 && (
                            <span className="text-red-500 ml-2 text-sm">⚠️</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(service.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("Infrastructure")}</CardTitle>
                <CardDescription>
                  {t("Database, storage, and content delivery systems")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Service")}</TableHead>
                      <TableHead className="hidden md:table-cell">{t("Uptime")}</TableHead>
                      <TableHead>{t("Response Time")}</TableHead>
                      <TableHead>{t("Status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {infrastructureServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{service.uptime}</TableCell>
                        <TableCell>
                          {service.responseTime}ms
                        </TableCell>
                        <TableCell>{getStatusBadge(service.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("System Metrics")}</CardTitle>
                <CardDescription>
                  {t("Current usage and historical metrics")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {metrics.map((metric) => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{t(metric.name)}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{t("Current")}: {metric.current}{metric.unit}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span>{t("Average")}: {metric.average}{metric.unit}</span>
                          <Separator orientation="vertical" className="h-4" />
                          <span>{t("Peak")}: {metric.peak}{metric.unit}</span>
                        </div>
                      </div>
                      <span className="text-xl font-bold">{metric.current}{metric.unit}</span>
                    </div>
                    <Progress
                      value={metric.current}
                      className="h-2"
                      indicatorClassName={getProgressColor(metric.current)}
                    />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="flex justify-between items-center w-full">
                  <div className="text-sm text-muted-foreground">{t("Load Average")}: 1.24, 1.15, 1.02</div>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">{t("Last Hour")}</Button>
                    <Button variant="outline" size="sm">{t("Last 24 Hours")}</Button>
                    <Button variant="outline" size="sm">{t("Last 7 Days")}</Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("CPU")}</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="size-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {t("Detailed CPU metrics graph will be displayed here")}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t("Memory")}</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="size-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {t("Detailed memory usage graph will be displayed here")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Incidents Tab */}
          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle>{t("Recent Incidents")}</CardTitle>
                <CardDescription>
                  {t("System issues and their resolution status")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {incidents.length > 0 ? (
                  <div className="space-y-5">
                    {incidents.map((incident) => (
                      <div key={incident.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{incident.service}</h4>
                            {getSeverityBadge(incident.severity)}
                            {getStatusBadge(incident.status)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(incident.timestamp), 'yyyy-MM-dd HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm">{incident.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Server className="size-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg">{t("No incidents reported")}</h3>
                    <p className="text-muted-foreground">
                      {t("All systems have been operating normally")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default SystemHealth;
