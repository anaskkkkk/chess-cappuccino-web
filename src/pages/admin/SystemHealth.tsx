
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, CheckCircle, AlertCircle, XCircle, RefreshCw,
  Server, Database, HardDrive, Zap, Network, 
  ArrowUp, ArrowRight, Clock, Cpu, HardDriveIcon, Gauge,
  BarChart4, Stethoscope
} from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { adminApi } from "@/services/api/endpoints/adminApi";

// Interface for system health data
interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  services: ServiceHealth[];
  resources: ResourceUsage[];
  incidents: IncidentRecord[];
  uptime: string;
  lastChecked: string;
}

interface ServiceHealth {
  id: string;
  name: string;
  type: 'core' | 'api' | 'database' | 'cache' | 'auth' | 'external';
  status: 'healthy' | 'warning' | 'critical' | 'unavailable';
  responseTime: number;
  lastChecked: string;
  details?: string;
}

interface ResourceUsage {
  id: string;
  name: string;
  type: 'cpu' | 'memory' | 'disk' | 'network';
  currentUsage: number;
  limit: number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  history?: number[];
}

interface IncidentRecord {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'investigating' | 'resolved' | 'monitoring';
  startTime: string;
  endTime?: string;
  services: string[];
  description: string;
  updates?: {
    time: string;
    message: string;
  }[];
}

// Mock data for system health
const mockSystemHealth: SystemHealth = {
  status: 'healthy',
  uptime: '99.98%',
  lastChecked: new Date().toISOString(),
  services: [
    {
      id: 'srv-1',
      name: 'Authentication Service',
      type: 'core',
      status: 'healthy',
      responseTime: 120,
      lastChecked: new Date().toISOString()
    },
    {
      id: 'srv-2',
      name: 'Game Engine',
      type: 'core',
      status: 'healthy',
      responseTime: 95,
      lastChecked: new Date().toISOString()
    },
    {
      id: 'srv-3',
      name: 'Database Cluster',
      type: 'database',
      status: 'healthy',
      responseTime: 150,
      lastChecked: new Date().toISOString()
    },
    {
      id: 'srv-4',
      name: 'Redis Cache',
      type: 'cache',
      status: 'warning',
      responseTime: 210,
      lastChecked: new Date().toISOString(),
      details: 'Higher than normal latency'
    },
    {
      id: 'srv-5',
      name: 'Payment Gateway',
      type: 'external',
      status: 'healthy',
      responseTime: 320,
      lastChecked: new Date().toISOString()
    },
    {
      id: 'srv-6',
      name: 'Email Service',
      type: 'external',
      status: 'critical',
      responseTime: 1200,
      lastChecked: new Date().toISOString(),
      details: 'Connection timeout'
    },
    {
      id: 'srv-7',
      name: 'Tournament Manager',
      type: 'api',
      status: 'healthy',
      responseTime: 130,
      lastChecked: new Date().toISOString()
    },
    {
      id: 'srv-8',
      name: 'Analytics Engine',
      type: 'api',
      status: 'healthy',
      responseTime: 280,
      lastChecked: new Date().toISOString()
    }
  ],
  resources: [
    {
      id: 'res-1',
      name: 'CPU',
      type: 'cpu',
      currentUsage: 43,
      limit: 100,
      unit: '%',
      trend: 'stable',
      history: [38, 42, 45, 39, 43, 47, 41, 40, 43]
    },
    {
      id: 'res-2',
      name: 'Memory',
      type: 'memory',
      currentUsage: 7.2,
      limit: 16,
      unit: 'GB',
      trend: 'up',
      history: [6.5, 6.8, 6.9, 7.0, 7.1, 7.2, 7.2, 7.2, 7.2]
    },
    {
      id: 'res-3',
      name: 'Disk Usage',
      type: 'disk',
      currentUsage: 340,
      limit: 500,
      unit: 'GB',
      trend: 'up',
      history: [320, 322, 325, 330, 332, 335, 338, 339, 340]
    },
    {
      id: 'res-4',
      name: 'Network',
      type: 'network',
      currentUsage: 120,
      limit: 1000,
      unit: 'Mbps',
      trend: 'down',
      history: [150, 145, 140, 135, 130, 125, 122, 121, 120]
    }
  ],
  incidents: [
    {
      id: 'inc-1',
      title: 'Email Service Degradation',
      severity: 'high',
      status: 'investigating',
      startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      services: ['srv-6'],
      description: 'Email service is experiencing high latency and occasional timeouts.'
    },
    {
      id: 'inc-2',
      title: 'Cache Performance Issues',
      severity: 'medium',
      status: 'monitoring',
      startTime: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 90 minutes ago
      services: ['srv-4'],
      description: 'Redis cache showing higher than normal latency affecting some API responses.'
    },
    {
      id: 'inc-3',
      title: 'Database Failover Event',
      severity: 'critical',
      status: 'resolved',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 24 hours ago
      endTime: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),   // 23 hours ago
      services: ['srv-3'],
      description: 'Database primary node failed and automatic failover was triggered.',
      updates: [
        {
          time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          message: 'Issue detected, investigating'
        },
        {
          time: new Date(Date.now() - 1000 * 60 * 60 * 23.5).toISOString(),
          message: 'Failover process initiated'
        },
        {
          time: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
          message: 'Failover complete, services restored'
        }
      ]
    }
  ]
};

const SystemHealth = () => {
  const { t } = useLanguageContext();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Query for system health data
  const { data: healthData, isLoading, refetch } = useQuery<SystemHealth>({
    queryKey: ['systemHealth'],
    queryFn: () => {
      // TODO: Replace with actual API call
      // return adminApi.getSystemHealth();
      console.log("Fetching system health data");
      return Promise.resolve(mockSystemHealth);
    },
    staleTime: 30000, // 30 seconds
  });
  
  const handleRefresh = () => {
    refetch();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'unavailable': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'unavailable': return <AlertCircle className="h-5 w-5 text-gray-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low': return <Badge variant="outline">Low</Badge>;
      case 'medium': return <Badge variant="default" className="bg-yellow-500">Medium</Badge>;
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'critical': return <Badge variant="destructive" className="bg-red-700">Critical</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getIncidentStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="outline" className="border-red-500 text-red-500">Active</Badge>;
      case 'investigating': return <Badge variant="outline" className="border-orange-500 text-orange-500">Investigating</Badge>;
      case 'monitoring': return <Badge variant="outline" className="border-blue-500 text-blue-500">Monitoring</Badge>;
      case 'resolved': return <Badge variant="outline" className="border-green-500 text-green-500">Resolved</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'core': return <Server className="h-4 w-4" />;
      case 'api': return <Network className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'cache': return <Zap className="h-4 w-4" />;
      case 'auth': return <HardDrive className="h-4 w-4" />;
      case 'external': return <ArrowRight className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };
  
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'cpu': return <Cpu className="h-4 w-4" />;
      case 'memory': return <HardDriveIcon className="h-4 w-4" />;
      case 'disk': return <HardDrive className="h-4 w-4" />;
      case 'network': return <Network className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };
  
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString();
    } catch (error) {
      return "Invalid date";
    }
  };
  
  // Service counts by status
  const serviceStatuses = {
    healthy: healthData?.services.filter(s => s.status === 'healthy').length || 0,
    warning: healthData?.services.filter(s => s.status === 'warning').length || 0,
    critical: healthData?.services.filter(s => s.status === 'critical').length || 0,
    unavailable: healthData?.services.filter(s => s.status === 'unavailable').length || 0,
    total: healthData?.services.length || 0
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
          <h2 className="text-2xl font-bold tracking-tight">{t("System Health")}</h2>
          <p className="text-muted-foreground">
            {t("Monitor the status and health of all system components")}
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          className="flex gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {t("Refresh Status")}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 dark:bg-gray-700 h-20 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{t("System Status")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center ${getStatusColor(healthData?.status || 'unavailable')}`}>
                    {getStatusIcon(healthData?.status || 'unavailable')}
                  </div>
                  <div>
                    <div className="text-2xl font-bold capitalize">{healthData?.status}</div>
                    <div className="text-sm text-muted-foreground">{t("Last checked")}: {formatTime(healthData?.lastChecked || '')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{t("Service Health")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 bg-green-500/10 rounded-md p-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{serviceStatuses.healthy} {t("Healthy")}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-500/10 rounded-md p-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{serviceStatuses.warning} {t("Warning")}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-red-500/10 rounded-md p-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium">{serviceStatuses.critical} {t("Critical")}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-500/10 rounded-md p-2">
                    <AlertCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{serviceStatuses.unavailable} {t("Unavailable")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{t("System Uptime")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <ArrowUp className="h-8 w-8 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{healthData?.uptime}</div>
                    <div className="text-sm text-muted-foreground">{t("Last 30 days")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{t("Resource Usage")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthData?.resources.map(resource => (
                    <div key={resource.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getResourceTypeIcon(resource.type)}
                          <span className="font-medium">{resource.name}</span>
                        </div>
                        <div className="text-sm">
                          {resource.currentUsage} / {resource.limit} {resource.unit}
                          {resource.trend === 'up' && <ArrowUp className="inline ml-1 h-3 w-3 text-red-500" />}
                          {resource.trend === 'down' && <ArrowUp className="inline ml-1 h-3 w-3 text-green-500 rotate-180" />}
                          {resource.trend === 'stable' && <ArrowRight className="inline ml-1 h-3 w-3 text-blue-500" />}
                        </div>
                      </div>
                      <Progress 
                        value={(resource.currentUsage / resource.limit) * 100} 
                        className={`
                          ${(resource.currentUsage / resource.limit) > 0.9 ? 'bg-red-200' : ''}
                          ${(resource.currentUsage / resource.limit) > 0.7 && (resource.currentUsage / resource.limit) <= 0.9 ? 'bg-yellow-200' : ''}
                          ${(resource.currentUsage / resource.limit) <= 0.7 ? 'bg-green-200' : ''}
                        `}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">{t("Active Incidents")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {healthData?.incidents.filter(i => i.status !== 'resolved').length === 0 ? (
                    <div className="text-center py-4">
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">{t("No active incidents")}</p>
                    </div>
                  ) : (
                    healthData?.incidents
                      .filter(i => i.status !== 'resolved')
                      .map(incident => (
                        <div key={incident.id} className="border rounded-md p-2">
                          <div className="flex justify-between items-start">
                            <div className="font-medium">{incident.title}</div>
                            {getSeverityBadge(incident.severity)}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {formatTime(incident.startTime)}
                          </div>
                          <div className="mt-2">
                            {getIncidentStatusBadge(incident.status)}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        
          <div className="mt-8">
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="services">{t("Services")}</TabsTrigger>
                <TabsTrigger value="resources">{t("Resources")}</TabsTrigger>
                <TabsTrigger value="incidents">{t("Incidents")}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services" className="space-y-4 mt-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 p-4 font-medium bg-muted">
                    <div className="col-span-4">{t("Service")}</div>
                    <div className="col-span-2">{t("Type")}</div>
                    <div className="col-span-2 text-center">{t("Status")}</div>
                    <div className="col-span-2 text-center">{t("Response Time")}</div>
                    <div className="col-span-2 text-right">{t("Last Checked")}</div>
                  </div>
                  
                  <div className="divide-y">
                    {healthData?.services.map(service => (
                      <div key={service.id} className="grid grid-cols-12 p-4">
                        <div className="col-span-4">
                          <div className="font-medium">{service.name}</div>
                          {service.details && (
                            <div className="text-sm text-muted-foreground mt-1">{service.details}</div>
                          )}
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          {getServiceTypeIcon(service.type)}
                          <span className="capitalize">{service.type}</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                            service.status === 'healthy' ? 'bg-green-500/10 text-green-600' :
                            service.status === 'warning' ? 'bg-yellow-500/10 text-yellow-600' :
                            service.status === 'critical' ? 'bg-red-500/10 text-red-600' :
                            'bg-gray-500/10 text-gray-600'
                          }`}>
                            {getStatusIcon(service.status)}
                            <span className="capitalize">{service.status}</span>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <Badge variant={
                            service.responseTime < 150 ? "outline" : 
                            service.responseTime < 300 ? "secondary" : 
                            "default"
                          }>
                            {service.responseTime}ms
                          </Badge>
                        </div>
                        <div className="col-span-2 text-right text-sm text-muted-foreground">
                          {formatTime(service.lastChecked)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healthData?.resources.map(resource => (
                    <Card key={resource.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium flex items-center gap-2">
                            {getResourceTypeIcon(resource.type)}
                            {resource.name}
                          </CardTitle>
                          <Badge variant={
                            (resource.currentUsage / resource.limit) > 0.9 ? "destructive" : 
                            (resource.currentUsage / resource.limit) > 0.7 ? "default" : 
                            "outline"
                          }>
                            {resource.currentUsage} / {resource.limit} {resource.unit}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Progress 
                            value={(resource.currentUsage / resource.limit) * 100} 
                            className={`h-3 ${
                              (resource.currentUsage / resource.limit) > 0.9 ? 'bg-red-200' : 
                              (resource.currentUsage / resource.limit) > 0.7 ? 'bg-yellow-200' : 
                              'bg-green-200'
                            }`}
                          />
                          
                          {resource.history && (
                            <div className="mt-4 h-16 flex items-end gap-1">
                              {resource.history.map((value, idx) => (
                                <div 
                                  key={idx} 
                                  className={`w-full bg-primary rounded-sm ${
                                    (value / resource.limit) > 0.9 ? 'bg-red-500' : 
                                    (value / resource.limit) > 0.7 ? 'bg-yellow-500' : 
                                    'bg-green-500'
                                  }`} 
                                  style={{ height: `${(value / resource.limit) * 100}%` }}
                                  title={`${value} ${resource.unit}`}
                                />
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                            <span>{t("Trend")}:</span>
                            <div className="flex items-center">
                              {resource.trend === 'up' && (
                                <div className="flex items-center text-red-500">
                                  <ArrowUp className="h-3 w-3 mr-1" /> {t("Increasing")}
                                </div>
                              )}
                              {resource.trend === 'down' && (
                                <div className="flex items-center text-green-500">
                                  <ArrowUp className="h-3 w-3 mr-1 rotate-180" /> {t("Decreasing")}
                                </div>
                              )}
                              {resource.trend === 'stable' && (
                                <div className="flex items-center text-blue-500">
                                  <ArrowRight className="h-3 w-3 mr-1" /> {t("Stable")}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="incidents" className="space-y-4 mt-4">
                {healthData?.incidents.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">{t("No incidents reported")}</h3>
                    <p className="text-sm text-muted-foreground">{t("All systems are operating normally")}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {healthData?.incidents.map(incident => (
                      <Card key={incident.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-medium">{incident.title}</CardTitle>
                            <div className="flex gap-2">
                              {getSeverityBadge(incident.severity)}
                              {getIncidentStatusBadge(incident.status)}
                            </div>
                          </div>
                          <CardDescription>
                            {t("Started")}: {formatTime(incident.startTime)}
                            {incident.endTime && (
                              <> • {t("Resolved")}: {formatTime(incident.endTime)}</>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4">{incident.description}</p>
                          
                          {incident.updates && incident.updates.length > 0 && (
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-2">{t("Updates")}</h4>
                              <div className="space-y-3">
                                {incident.updates.map((update, idx) => (
                                  <div key={idx} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                                      {idx < incident.updates!.length - 1 && (
                                        <div className="w-0.5 h-full bg-primary/30"></div>
                                      )}
                                    </div>
                                    <div className="space-y-1 pb-3">
                                      <div className="text-sm text-muted-foreground">{formatTime(update.time)}</div>
                                      <div>{update.message}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            <div className="text-sm text-muted-foreground mr-1">{t("Affected services")}:</div>
                            {incident.services.map((serviceId) => {
                              const service = healthData.services.find(s => s.id === serviceId);
                              return service && (
                                <Badge key={serviceId} variant="outline">
                                  {service.name}
                                </Badge>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default SystemHealth;
