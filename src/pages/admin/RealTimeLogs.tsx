import React, { useState, useEffect, useRef } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { websocketApi } from "@/services/api/endpoints/websocketApi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DownloadCloud,
  Filter,
  Play,
  Pause,
  RefreshCw,
  Search,
  Plus,
} from "lucide-react";
import useWebSocket from "@/hooks/useWebSocket";
import { WebSocketMessageType } from "@/services/websocketService";

// Log entry type definition
type LogEntry = {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  message: string;
  source: string;
  details?: Record<string, any>;
};

const RealTimeLogs = () => {
  const { t } = useLanguageContext();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [logLevel, setLogLevel] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("system");
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Fetch auth token for WebSocket connection
  const { data: authTokenData } = useQuery({
    queryKey: ["websocketAuth"],
    queryFn: async () => {
      const response = await websocketApi.getAuthToken();
      return response.data?.token || null;
    },
  });
  
  // Connect to WebSocket for real-time logs
  const { isConnected } = useWebSocket<LogEntry>(
    WebSocketMessageType.SYSTEM_LOG,
    (data) => {
      if (isStreaming) {
        setLogs((prevLogs) => {
          // Keep only the latest 500 logs to prevent memory issues
          const updatedLogs = [...prevLogs, data];
          return updatedLogs.slice(Math.max(0, updatedLogs.length - 500));
        });
        
        // Auto-scroll to bottom if already at bottom
        if (logContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = logContainerRef.current;
          if (scrollHeight - scrollTop <= clientHeight + 50) {
            setTimeout(() => {
              if (logContainerRef.current) {
                logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
              }
            }, 0);
          }
        }
      }
    },
    {
      authToken: authTokenData,
      channel: activeTab,
      onOpen: () => {
        toast.success(t("Connected to log server"));
      },
      onClose: () => {
        toast.error(t("Disconnected from log server"));
      },
      onError: (error) => {
        toast.error(`${t("Connection error")}: ${error.message || t("Please try again later")}`);
      },
    }
  );
  
  // Fetch initial logs
  const fetchInitialLogs = async () => {
    try {
      const response = await websocketApi.getLogs({ 
        source: activeTab, 
        level: logLevel !== "all" ? logLevel : undefined,
        query: searchQuery || undefined,
        limit: 100 
      });
      setLogs(response.data || []);
    } catch (error) {
      toast.error(t("Failed to fetch logs"));
    }
  };
  
  // Effect for tab changes
  useEffect(() => {
    fetchInitialLogs();
  }, [activeTab]);
  
  // Filter logs based on current filter settings
  const filteredLogs = logs.filter((log) => {
    // Filter by log level
    if (logLevel !== "all" && log.level !== logLevel) return false;
    
    // Filter by search query
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !log.source.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Get log level badge color
  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">{level}</Badge>;
      case "warning":
        return <Badge variant="warning" className="bg-yellow-500">{level}</Badge>;
      case "info":
        return <Badge variant="secondary">{level}</Badge>;
      case "debug":
        return <Badge variant="outline">{level}</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-chess-text-light">{t("Real-Time Logs")}</h1>
          <p className="text-sm text-chess-text-light/70 mt-1">
            {t("Monitor system activity and troubleshoot issues in real-time")}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? (
              <>
                <Pause className="h-4 w-4" />
                <span>{t("Pause")}</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>{t("Resume")}</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={fetchInitialLogs}
          >
            <RefreshCw className="h-4 w-4" />
            <span>{t("Refresh")}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <DownloadCloud className="h-4 w-4" />
            <span>{t("Export")}</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar with filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t("Filters")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="search">
                  {t("Search")}
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    className="pl-8"
                    placeholder={t("Search logs...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="level">
                  {t("Log Level")}
                </label>
                <Select value={logLevel} onValueChange={setLogLevel}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder={t("Select level")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("All Levels")}</SelectItem>
                    <SelectItem value="error">{t("Error")}</SelectItem>
                    <SelectItem value="warning">{t("Warning")}</SelectItem>
                    <SelectItem value="info">{t("Info")}</SelectItem>
                    <SelectItem value="debug">{t("Debug")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("Quick Filters")}
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setLogLevel("error")}
                  >
                    {t("Errors")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setSearchQuery("auth")}
                  >
                    {t("Auth")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setSearchQuery("api")}
                  >
                    {t("API")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs flex items-center"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {t("Custom")}
                  </Button>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm flex items-center mb-2">
                  <Filter className="h-4 w-4 mr-1" />
                  {t("Active Filters")}
                </p>
                {(searchQuery || logLevel !== "all") ? (
                  <div className="space-y-1">
                    {searchQuery && (
                      <div className="flex items-center justify-between bg-gray-800/30 px-2 py-1 rounded text-sm">
                        <span>{t("Search")}: {searchQuery}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 w-5 p-0" 
                          onClick={() => setSearchQuery("")}
                        >
                          ×
                        </Button>
                      </div>
                    )}
                    {logLevel !== "all" && (
                      <div className="flex items-center justify-between bg-gray-800/30 px-2 py-1 rounded text-sm">
                        <span>{t("Level")}: {logLevel}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 w-5 p-0" 
                          onClick={() => setLogLevel("all")}
                        >
                          ×
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    {t("No active filters")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side - logs display */}
        <div className="lg:col-span-3">
          <Card className="h-[700px] flex flex-col">
            <CardHeader className="p-3 border-b">
              <Tabs defaultValue="system" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="system">{t("System")}</TabsTrigger>
                  <TabsTrigger value="api">{t("API")}</TabsTrigger>
                  <TabsTrigger value="auth">{t("Authentication")}</TabsTrigger>
                  <TabsTrigger value="games">{t("Games")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              {/* Connection status indicator */}
              <div className={`px-3 py-1 text-xs border-b flex items-center ${
                isConnected ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                <span>
                  {isConnected 
                    ? t("Connected to log server - Live streaming") 
                    : t("Disconnected from log server")}
                </span>
              </div>
              
              {/* Logs container */}
              <div 
                ref={logContainerRef}
                className="h-[calc(100%-28px)] overflow-y-auto font-mono text-sm p-1"
                style={{ backgroundColor: "#121212" }}
              >
                {filteredLogs.length > 0 ? (
                  <div className="space-y-1 p-2">
                    {filteredLogs.map((log) => (
                      <div 
                        key={log.id} 
                        className={`p-2 rounded ${
                          log.level === "error" ? "bg-red-950/30" :
                          log.level === "warning" ? "bg-yellow-950/30" :
                          log.level === "info" ? "bg-blue-950/30" : "bg-gray-800/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400">{formatTimestamp(log.timestamp)}</span>
                          {getLogLevelBadge(log.level)}
                          <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">{log.source}</span>
                        </div>
                        <div className="text-chess-text-light">{log.message}</div>
                        {log.details && (
                          <div className="mt-1 text-xs text-gray-400 overflow-x-auto">
                            <pre>{JSON.stringify(log.details, null, 2)}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {searchQuery || logLevel !== "all" 
                      ? t("No logs match your current filters") 
                      : t("No logs available")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeLogs;
