
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Clock, RefreshCw, Server, XCircle } from 'lucide-react';
import { useLanguageContext } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Mock data for system health
const services = [
  { id: 'api', name: 'Main API', status: 'healthy', uptime: '99.98%', responseTime: 42, uptimeDays: 124 },
  { id: 'db', name: 'Database', status: 'healthy', uptime: '99.95%', responseTime: 29, uptimeDays: 89 },
  { id: 'storage', name: 'Storage', status: 'healthy', uptime: '99.99%', responseTime: 55, uptimeDays: 201 },
  { id: 'auth', name: 'Auth Service', status: 'warning', uptime: '99.8%', responseTime: 87, uptimeDays: 62 },
  { id: 'websocket', name: 'WebSocket', status: 'healthy', uptime: '99.9%', responseTime: 18, uptimeDays: 142 },
  { id: 'search', name: 'Search Service', status: 'critical', uptime: '98.2%', responseTime: 230, uptimeDays: 3 },
  { id: 'email', name: 'Email Service', status: 'healthy', uptime: '99.96%', responseTime: 64, uptimeDays: 78 },
  { id: 'cdn', name: 'CDN', status: 'healthy', uptime: '99.99%', responseTime: 22, uptimeDays: 185 }
];

const resourceMetrics = {
  cpu: { current: 42, average: 38, peak: 78 },
  memory: { current: 65, average: 60, peak: 89 },
  disk: { current: 58, average: 55, peak: 72 },
  network: { 
    in: { current: 12.4, average: 10.2, peak: 45.6 },
    out: { current: 8.7, average: 7.5, peak: 32.1 }
  },
  connections: 1245,
  requests: 345,
  errors: 12,
  diskIO: { read: 2.4, write: 3.8 }
};

const incidents = [
  { 
    id: 'inc-001', 
    title: 'Search service degradation', 
    status: 'ongoing', 
    severity: 'critical',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: 'Search service is experiencing high latency and occasional timeouts.',
  },
  { 
    id: 'inc-002', 
    title: 'Auth service warning', 
    status: 'investigating', 
    severity: 'warning',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    description: 'Occasional authentication failures reported by a subset of users.',
  },
  { 
    id: 'inc-003', 
    title: 'Database index rebuild', 
    status: 'resolved', 
    severity: 'warning',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Planned database maintenance completed successfully.',
    resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Custom component to display service health status
const ServiceStatusBadge = ({ status }: { status: string }) => {
  let color;
  let icon;
  
  switch (status) {
    case 'healthy':
      color = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
      break;
    case 'warning':
      color = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      icon = <AlertCircle className="w-3 h-3 mr-1" />;
      break;
    case 'critical':
      color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      icon = <XCircle className="w-3 h-3 mr-1" />;
      break;
    default:
      color = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      icon = <Clock className="w-3 h-3 mr-1" />;
  }
  
  return (
    <div className={`flex items-center px-2 py-1 text-xs font-medium rounded-full ${color}`}>
      {icon}
      <span className="capitalize">{status}</span>
    </div>
  );
};

// Custom component for metric display
const MetricDisplay = ({ 
  label, 
  value, 
  unit = '', 
  trend = 'neutral', 
  size = 'medium' 
}) => {
  const trendColors = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };
  
  const sizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  };
  
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <div className="flex items-end gap-1">
        <span className={`font-semibold ${sizes[size]}`}>{value}</span>
        {unit && <span className="text-sm text-gray-600 dark:text-gray-400">{unit}</span>}
      </div>
    </div>
  );
};

// Custom resource usage component with progress bar
const ResourceUsage = ({ value, label, className = "" }) => {
  // Determine color based on value
  let progressColor = "bg-blue-500";
  if (value > 80) progressColor = "bg-red-500";
  else if (value > 60) progressColor = "bg-amber-500";
  else if (value > 40) progressColor = "bg-green-500";
  
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress 
        value={value}
        className="h-2 bg-gray-200 dark:bg-gray-700" 
      />
    </div>
  );
};

const SystemHealth = () => {
  const { t } = useLanguageContext();
  const { toast } = useToast();
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [activeTab, setActiveTab] = useState("services");
  
  const refreshData = () => {
    // TODO: API call to refresh system health data
    toast({
      title: "Data refreshed",
      description: "System health data has been updated."
    });
    setLastUpdated(new Date().toISOString());
  };
  
  const runDiagnostics = () => {
    setIsRunningDiagnostics(true);
    
    // Simulate diagnostic run
    setTimeout(() => {
      setIsRunningDiagnostics(false);
      toast({
        title: t("Diagnostics completed"),
        description: "All system services have been checked."
      });
    }, 3000);
    
    toast({
      title: t("Running diagnostics..."),
      description: "This may take a few moments."
    });
  };
  
  const resolveIncident = (id) => {
    // TODO: API call to resolve incident
    toast({
      title: "Incident marked as resolved",
      description: "The incident has been updated."
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  const calculateSystemStatus = () => {
    const criticalServices = services.filter(s => s.status === 'critical').length;
    const warningServices = services.filter(s => s.status === 'warning').length;
    
    if (criticalServices > 0) return 'critical';
    if (warningServices > 0) return 'degraded';
    return 'healthy';
  };
  
  const systemStatus = calculateSystemStatus();
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("System Health")}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t("Monitor server status, resource usage, and system performance")}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={refreshData}
            className="flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            {t("Refresh Data")}
          </Button>
          
          <Button
            onClick={runDiagnostics}
            disabled={isRunningDiagnostics}
            className="flex items-center gap-1"
          >
            <Server className="w-4 h-4" />
            {isRunningDiagnostics ? t("Running diagnostics...") : t("Run Diagnostics")}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("System Status")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {systemStatus === 'healthy' && (
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              )}
              {systemStatus === 'degraded' && (
                <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              )}
              {systemStatus === 'critical' && (
                <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              )}
              <div>
                <div className="font-medium text-lg capitalize">
                  {systemStatus === 'healthy' ? t("Healthy") : 
                   systemStatus === 'degraded' ? t("Degraded") : 
                   t("Critical")}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t("Last Updated")}: {formatDate(lastUpdated)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("Active Connections")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <MetricDisplay 
                label={t("Current")}
                value={resourceMetrics.connections.toLocaleString()}
                size="large"
              />
              <div className="flex items-center gap-1">
                <MetricDisplay 
                  label={t("requests")}
                  value={resourceMetrics.requests}
                  size="small"
                />
                <Separator orientation="vertical" className="h-8" />
                <MetricDisplay 
                  label={t("errors")}
                  value={resourceMetrics.errors}
                  size="small"
                  trend="negative"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t("Disk I/O")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <MetricDisplay 
                label={t("Read")}
                value={resourceMetrics.diskIO.read}
                unit="MB/s"
                size="medium"
              />
              <Separator orientation="vertical" className="h-8" />
              <MetricDisplay 
                label={t("Write")}
                value={resourceMetrics.diskIO.write}
                unit="MB/s"
                size="medium"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="services">{t("Services")}</TabsTrigger>
          <TabsTrigger value="resources">{t("Resources")}</TabsTrigger>
          <TabsTrigger value="incidents">{t("Incidents")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Services Status")}</CardTitle>
              <CardDescription>
                {t("Overview of all system services and their current status")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    variants={itemVariants}
                  >
                    <Card className="overflow-hidden">
                      <div className={`h-1 w-full ${
                        service.status === 'healthy' ? 'bg-green-500' :
                        service.status === 'warning' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}></div>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{t(service.name)}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <span>{service.uptime} {t("Uptime")}</span>
                              •
                              <span>{service.responseTime}ms</span>
                            </div>
                          </div>
                          <ServiceStatusBadge status={service.status} />
                        </div>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {service.uptimeDays} {service.uptimeDays === 1 ? t("day") : t("days")} {t("without restart")}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("System Metrics")}</CardTitle>
              <CardDescription>
                {t("Resource usage metrics for the system")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="font-medium text-lg">{t("CPU")}</h3>
                  <ResourceUsage value={resourceMetrics.cpu.current} label={t("CPU Usage")} />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <MetricDisplay 
                      label={t("Average")}
                      value={`${resourceMetrics.cpu.average}%`}
                    />
                    <MetricDisplay 
                      label={t("Peak")}
                      value={`${resourceMetrics.cpu.peak}%`}
                      trend="negative"
                    />
                  </div>
                  
                  <h3 className="font-medium text-lg mt-6">{t("Memory")}</h3>
                  <ResourceUsage value={resourceMetrics.memory.current} label={t("Memory Usage")} />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <MetricDisplay 
                      label={t("Average")}
                      value={`${resourceMetrics.memory.average}%`}
                    />
                    <MetricDisplay 
                      label={t("Peak")}
                      value={`${resourceMetrics.memory.peak}%`}
                      trend="negative"
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="font-medium text-lg">{t("Disk")}</h3>
                  <ResourceUsage value={resourceMetrics.disk.current} label={t("Disk Usage")} />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <MetricDisplay 
                      label={t("Free")}
                      value={`${100 - resourceMetrics.disk.current}%`}
                      trend="positive"
                    />
                    <MetricDisplay 
                      label={t("Used")}
                      value={`${resourceMetrics.disk.current}%`}
                    />
                  </div>
                  
                  <h3 className="font-medium text-lg mt-6">{t("Network")}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <MetricDisplay 
                      label={t("Network In")}
                      value={resourceMetrics.network.in.current}
                      unit="MB/s"
                    />
                    <MetricDisplay 
                      label={t("Network Out")}
                      value={resourceMetrics.network.out.current}
                      unit="MB/s"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <MetricDisplay 
                      label={t("Peak") + " " + t("In")}
                      value={resourceMetrics.network.in.peak}
                      unit="MB/s"
                    />
                    <MetricDisplay 
                      label={t("Peak") + " " + t("Out")}
                      value={resourceMetrics.network.out.peak}
                      unit="MB/s"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="incidents" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("Recent Incidents")}</CardTitle>
              <CardDescription>
                {incidents.length > 0 
                  ? `${incidents.length} ${incidents.length === 1 ? 'incident' : 'incidents'} in the last 7 days` 
                  : t("No incidents reported")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incidents.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  {t("No incidents reported")}
                </div>
              ) : (
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {incidents.map(incident => (
                    <motion.div
                      key={incident.id}
                      variants={itemVariants}
                      className="border border-gray-200 dark:border-gray-800 rounded-lg p-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              incident.severity === 'critical' ? 'destructive' :
                              incident.severity === 'warning' ? 'warning' :
                              'default'
                            }>
                              {incident.severity}
                            </Badge>
                            <Badge variant={
                              incident.status === 'resolved' ? 'outline' : 
                              incident.status === 'investigating' ? 'secondary' :
                              'default'
                            }>
                              {incident.status}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-lg mt-2">{incident.title}</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {incident.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-start md:items-end gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <div>
                            {formatDate(incident.timestamp)}
                          </div>
                          {incident.status !== 'resolved' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveIncident(incident.id)}
                            >
                              {t("Mark as Resolved")}
                            </Button>
                          ) : (
                            <div>
                              {t("Resolved")}: {formatDate(incident.resolvedAt)}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealth;
