
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { 
  Activity, CheckCircle, AlertCircle, XCircle, RefreshCw,
  Server, Database, HardDrive, Zap, Network, 
  ArrowUp, ArrowRight, Clock, Cpu, Memory, HardDriveIcon, Gauge,
  BarChart4, Stethoscope
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { adminApi } from "@/services/api/endpoints/adminApi";

// Mock data - would come from API in real implementation
const systemHealthMock = {
  services: [
    { 
      id: 1, 
      name: "Main API", 
      status: "healthy", 
      uptime: "99.8%", 
      uptimeDays: 73,
      responseTime: 127,
      category: "backend"
    },
    { 
      id: 2, 
      name: "Database", 
      status: "healthy", 
      uptime: "99.9%", 
      uptimeDays: 124,
      responseTime: 35,
      category: "backend"
    },
    { 
      id: 3, 
      name: "Storage", 
      status: "healthy", 
      uptime: "100%", 
      uptimeDays: 182,
      responseTime: 95,
      category: "backend"
    },
    { 
      id: 4, 
      name: "Auth Service", 
      status: "healthy", 
      uptime: "99.7%", 
      uptimeDays: 45,
      responseTime: 142,
      category: "backend"
    },
    { 
      id: 5, 
      name: "WebSocket", 
      status: "warning", 
      uptime: "98.2%", 
      uptimeDays: 21,
      responseTime: 223,
      category: "backend"
    },
    { 
      id: 6, 
      name: "Search Service", 
      status: "healthy", 
      uptime: "99.5%", 
      uptimeDays: 67,
      responseTime: 187,
      category: "backend"
    },
    { 
      id: 7, 
      name: "Email Service", 
      status: "critical", 
      uptime: "93.4%", 
      uptimeDays: 5,
      responseTime: 876,
      category: "external"
    },
    { 
      id: 8, 
      name: "CDN", 
      status: "healthy", 
      uptime: "99.9%", 
      uptimeDays: 145,
      responseTime: 32,
      category: "infrastructure"
    }
  ],
  resources: {
    cpu: {
      current: 32,
      average: 28,
      peak: 76
    },
    memory: {
      current: 58,
      average: 55,
      peak: 87,
      free: "7.2 GB",
      used: "9.8 GB"
    },
    disk: {
      current: 72,
      average: 70,
      peak: 72,
      free: "234 GB",
      used: "601 GB"
    },
    network: {
      in: "1.2 GB/s",
      out: "876 MB/s",
      connections: 2347
    },
    requests: {
      perMinute: 12483,
      errors: 23
    },
    load: {
      current: "2.14",
      avg1: "2.23",
      avg5: "2.01",
      avg15: "1.87"
    }
  },
  incidents: [
    {
      id: 1,
      title: "API Gateway Timeout",
      severity: "medium",
      status: "resolved",
      started: "2025-05-03T14:23:12Z",
      resolved: "2025-05-03T15:46:07Z",
      affectedServices: ["Main API", "Auth Service"],
      description: "API gateway experienced intermittent timeouts due to traffic spike."
    },
    {
      id: 2,
      title: "Database Connection Issues",
      severity: "high",
      status: "resolved",
      started: "2025-05-02T08:17:22Z",
      resolved: "2025-05-02T09:03:55Z",
      affectedServices: ["Database", "Main API"],
      description: "Connection pool exhaustion caused by query optimization issue."
    },
    {
      id: 3,
      title: "Email Service Outage",
      severity: "critical",
      status: "ongoing",
      started: "2025-05-06T07:44:12Z",
      resolved: null,
      affectedServices: ["Email Service"],
      description: "Third-party email provider experiencing service disruption."
    }
  ]
};

// Status indicator component
const StatusIndicator = ({ status }: { status: string }) => {
  switch (status) {
    case "healthy":
      return (
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-1.5" />
          <span className="font-medium text-green-500">Healthy</span>
        </div>
      );
    case "warning":
      return (
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-1.5" />
          <span className="font-medium text-amber-500">Warning</span>
        </div>
      );
    case "critical":
      return (
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-red-500 mr-1.5" />
          <span className="font-medium text-red-500">Critical</span>
        </div>
      );
    case "unavailable":
      return (
        <div className="flex items-center">
          <XCircle className="h-5 w-5 text-gray-500 mr-1.5" />
          <span className="font-medium text-gray-500">Unavailable</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-gray-400 mr-1.5" />
          <span className="font-medium text-gray-400">Unknown</span>
        </div>
      );
  }
};

// Function to determine badge color based on severity
const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "low":
      return "outline";
    case "medium":
      return "secondary";
    case "high": 
      return "destructive";
    case "critical":
      return "destructive";
    default:
      return "outline";
  }
};

const SystemHealth = () => {
  const { t } = useLanguageContext();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  // Query to fetch system health data
  const { data: healthData, isLoading, error, refetch } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: () => {
      // TODO: Replace with actual API call
      // return adminApi.getSystemHealth();
      return new Promise(resolve => {
        setTimeout(() => resolve(systemHealthMock), 1000);
      });
    }
  });

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };
  
  const handleRunDiagnostics = () => {
    setIsRunningDiagnostics(true);
    
    // Simulate diagnostics running
    setTimeout(() => {
      setIsRunningDiagnostics(false);
      handleRefresh();
    }, 3000);
  };
  
  // Filter services by category
  const filteredServices = healthData?.services.filter(service => 
    selectedCategory === "all" ? true : service.category === selectedCategory
  ) || [];

  // Calculate overall system status
  const getOverallStatus = () => {
    if (!healthData?.services.length) return "unknown";
    
    if (healthData.services.some(service => service.status === "critical")) {
      return "critical";
    }
    
    if (healthData.services.some(service => service.status === "warning")) {
      return "warning";
    }
    
    return "healthy";
  };

  // Calculate uptime percentage
  const calculateUptimePercentage = () => {
    if (!healthData?.services.length) return 0;
    
    const uptimeSum = healthData.services.reduce((sum, service) => {
      return sum + parseFloat(service.uptime.replace('%', ''));
    }, 0);
    
    return (uptimeSum / healthData.services.length).toFixed(1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("System Health")}</h2>
          <p className="text-muted-foreground">
            {t("Monitor server status, resource usage, and system performance")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRunDiagnostics} 
            variant="outline"
            disabled={isRunningDiagnostics}
            className="flex items-center gap-2"
          >
            <Stethoscope className="h-4 w-4" />
            {isRunningDiagnostics ? t("Running diagnostics...") : t("Run Diagnostics")}
          </Button>
          <Button 
            onClick={handleRefresh} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {t("Refresh Data")}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* System Status Summary */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{t("System Status")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              {getOverallStatus() === "healthy" && (
                <CheckCircle className="h-12 w-12 text-green-500" />
              )}
              {getOverallStatus() === "warning" && (
                <AlertCircle className="h-12 w-12 text-amber-500" />
              )}
              {getOverallStatus() === "critical" && (
                <XCircle className="h-12 w-12 text-red-500" />
              )}
              {getOverallStatus() === "unknown" && (
                <AlertCircle className="h-12 w-12 text-gray-400" />
              )}
              
              <h3 className="text-xl font-medium">
                {getOverallStatus() === "healthy" && t("Healthy")}
                {getOverallStatus() === "warning" && t("Degraded")}
                {getOverallStatus() === "critical" && t("Critical")}
                {getOverallStatus() === "unknown" && t("Unknown")}
              </h3>
              
              <p className="text-sm text-muted-foreground">
                {healthData?.services.length} {t("Services")}
              </p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t("Uptime")}</span>
                <span className="font-medium">{calculateUptimePercentage()}%</span>
              </div>
              <Progress value={parseFloat(calculateUptimePercentage())} className="h-2" />
            </div>
            
            <div className="text-xs text-muted-foreground">
              {t("Last Updated")}: {lastUpdate.toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">{t("System Metrics")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CPU Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cpu className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{t("CPU Usage")}</span>
                  </div>
                  <span className="text-sm font-medium">{healthData?.resources.cpu.current}%</span>
                </div>
                <Progress value={healthData?.resources.cpu.current} className="h-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("Average")}: {healthData?.resources.cpu.average}%</span>
                  <span>{t("Peak")}: {healthData?.resources.cpu.peak}%</span>
                </div>
              </div>
              
              {/* Memory Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Memory className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{t("Memory Usage")}</span>
                  </div>
                  <span className="text-sm font-medium">{healthData?.resources.memory.current}%</span>
                </div>
                <Progress value={healthData?.resources.memory.current} className="h-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("Free")}: {healthData?.resources.memory.free}</span>
                  <span>{t("Used")}: {healthData?.resources.memory.used}</span>
                </div>
              </div>
              
              {/* Disk Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HardDriveIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{t("Disk Usage")}</span>
                  </div>
                  <span className="text-sm font-medium">{healthData?.resources.disk.current}%</span>
                </div>
                <Progress value={healthData?.resources.disk.current} className="h-1" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("Free")}: {healthData?.resources.disk.free}</span>
                  <span>{t("Used")}: {healthData?.resources.disk.used}</span>
                </div>
              </div>
              
              {/* Load Average */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Gauge className="h-4 w-4 mr-1.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{t("Load Average")}</span>
                  </div>
                  <span className="text-sm font-medium">{healthData?.resources.load.current}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-3">
                  <div className="space-x-2">
                    <span>1m: {healthData?.resources.load.avg1}</span>
                    <span>5m: {healthData?.resources.load.avg5}</span>
                    <span>15m: {healthData?.resources.load.avg15}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="services">
        <TabsList className="grid grid-cols-3 max-w-[400px]">
          <TabsTrigger value="services">{t("Services")}</TabsTrigger>
          <TabsTrigger value="resources">{t("Resources")}</TabsTrigger>
          <TabsTrigger value="incidents">{t("Incidents")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="space-y-4">
          <div className="flex items-center space-x-2 py-2">
            <Button
              variant={selectedCategory === "all" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              {t("All")}
            </Button>
            <Button
              variant={selectedCategory === "backend" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("backend")}
            >
              {t("Backend Services")}
            </Button>
            <Button
              variant={selectedCategory === "infrastructure" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("infrastructure")}
            >
              {t("Infrastructure")}
            </Button>
            <Button
              variant={selectedCategory === "external" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("external")}
            >
              {t("External Services")}
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">{t("Service")}</TableHead>
                  <TableHead>{t("Status")}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("Uptime")}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("Response Time")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </TableCell>
                      <TableCell>
                        <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No services found matching your filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <StatusIndicator status={service.status} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center">
                          <span className="font-medium">{service.uptime}</span>
                          <span className="text-muted-foreground text-xs ml-2">
                            ({service.uptimeDays} {service.uptimeDays === 1 ? t("day") : t("days")})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="font-medium">{service.responseTime} {t("ms")}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* CPU Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{t("CPU")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <BarChart4 className="h-16 w-16" />
                  {/* CPU chart would go here */}
                </div>
              </CardContent>
            </Card>
            
            {/* Memory Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{t("Memory")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <BarChart4 className="h-16 w-16" />
                  {/* Memory chart would go here */}
                </div>
              </CardContent>
            </Card>
            
            {/* Network Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{t("Network")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <BarChart4 className="h-16 w-16" />
                  {/* Network chart would go here */}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">{t("Current")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-1">{t("Network In")}</h3>
                  <p className="text-2xl font-semibold">{healthData?.resources.network.in}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">{t("Network Out")}</h3>
                  <p className="text-2xl font-semibold">{healthData?.resources.network.out}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">{t("Active Connections")}</h3>
                  <p className="text-2xl font-semibold">{healthData?.resources.network.connections}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">{t("requests")}/{t("errors")}</h3>
                  <p className="text-2xl font-semibold">
                    {healthData?.resources.requests.perMinute}/{' '}
                    <span className="text-red-500">{healthData?.resources.requests.errors}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="incidents" className="space-y-4">
          <h3 className="text-lg font-medium">{t("Recent Incidents")}</h3>
          
          {healthData?.incidents.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                {t("No incidents reported")}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {healthData?.incidents.map((incident) => (
                <Card key={incident.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base font-medium">{incident.title}</CardTitle>
                        <CardDescription>
                          {new Date(incident.started).toLocaleString()}
                        </CardDescription>
                      </div>
                      <Badge variant={getSeverityBadge(incident.severity)}>
                        {incident.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm">{incident.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {incident.affectedServices.map((service, idx) => (
                        <Badge key={idx} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between items-center w-full text-sm">
                      <Badge variant={incident.status === "resolved" ? "outline" : "destructive"}>
                        {incident.status === "resolved" ? t("Resolved") : t("Open")}
                      </Badge>
                      
                      {incident.resolved && (
                        <span className="text-muted-foreground">
                          {t("Resolved")}: {new Date(incident.resolved).toLocaleString()}
                        </span>
                      )}
                      
                      {!incident.resolved && (
                        <Button variant="outline" size="sm">
                          {t("Mark as Resolved")}
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SystemHealth;
