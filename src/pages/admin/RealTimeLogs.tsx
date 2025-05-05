import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useLanguageContext } from "@/contexts/LanguageContext";
import useWebSocket, { ConnectionStatus } from "@/hooks/useWebSocket";
import { WebSocketMessageType } from "@/services/websocketService";
import { websocketApi } from "@/services/api/endpoints/websocketApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Activity, 
  AlertCircle, 
  Clock, 
  Download, 
  Eye, 
  Filter, 
  Search, 
  Terminal, 
  Wifi, 
  WifiOff 
} from "lucide-react";
import {
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger
} from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface Log {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  source: string;
  message: string;
  details?: any;
}

const LogItem: React.FC<{ log: Log }> = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguageContext();
  
  // Get icon based on log level
  const getIcon = () => {
    switch (log.level) {
      case "error": return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "info": return <Activity className="h-4 w-4 text-blue-500" />;
      case "debug": return <Terminal className="h-4 w-4 text-green-500" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };
  
  // Get badge color based on log level
  const getBadgeVariant = () => {
    switch (log.level) {
      case "error": return "destructive";
      case "warning": return "outline";
      case "info": return "default";
      case "debug": return "secondary";
      default: return "outline";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b border-gray-700 py-2"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-mono text-xs text-gray-400">
            {new Date(log.timestamp).toLocaleTimeString()}
          </span>
          <Badge variant={getBadgeVariant()} className="ml-2 text-xs">
            {log.level.toUpperCase()}
          </Badge>
          <span className="ml-2 text-sm text-gray-300">{log.source}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {log.details && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? t("Collapse") : t("Expand")}
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-1 text-sm">{log.message}</div>
      
      {expanded && log.details && (
        <div className="mt-2 p-2 bg-gray-800 rounded font-mono text-xs overflow-auto max-h-40">
          <pre>{JSON.stringify(log.details, null, 2)}</pre>
        </div>
      )}
    </motion.div>
  );
};

const RealTimeLogs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("live");
  const [page, setPage] = useState(1);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguageContext();

  // Fetch auth token for WebSocket connection
  const { data: authData, isLoading: isLoadingAuth } = useQuery({
    queryKey: ["websocketAuth"],
    queryFn: async () => {
      const response = await websocketApi.getAuthToken();
      setAuthToken(response.token);
      return response;
    }
  });

  // Fetch historical logs
  const { data: historicalLogs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ["systemLogs", page, filter !== "all" ? filter : undefined],
    queryFn: async () => {
      const filters = filter !== "all" ? { level: filter } : {};
      const response = await websocketApi.getSystemLogs(page, 50, filters);
      return response.data || [];
    },
    enabled: activeTab === "history"
  });

  // Connect to WebSocket for real-time logs
  const { status, isConnected } = useWebSocket<Log>(
    WebSocketMessageType.SYSTEM_LOG,
    (log) => {
      setLogs(prevLogs => {
        const newLogs = [...prevLogs, log];
        // Keep only the latest 100 logs to prevent memory issues
        return newLogs.slice(-100);
      });
    },
    { 
      authToken: authToken || undefined,
      onError: (error) => {
        toast.error(`${t("WebSocket Error")}: ${(error as any).message || t("Connection Failed")}`);
      }
    }
  );

  // Scroll to bottom on new logs
  useEffect(() => {
    if (logs.length > 0 && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Filter logs based on level and search text
  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === "all" || log.level === filter;
    const matchesSearch = search === "" || 
      log.message.toLowerCase().includes(search.toLowerCase()) || 
      log.source.toLowerCase().includes(search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Get the status indicator based on the WebSocket connection status
  const getStatusIndicator = () => {
    if (status === "connected") {
      return (
        <div className="flex items-center text-green-500">
          <Wifi className="h-4 w-4 mr-1" />
          <span className="text-xs">{t("Connected")}</span>
        </div>
      );
    }
    
    if (status === "connecting") {
      return (
        <div className="flex items-center text-amber-500">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Activity className="h-4 w-4 mr-1" />
          </motion.div>
          <span className="text-xs">{t("Connecting")}</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-red-500">
        <WifiOff className="h-4 w-4 mr-1" />
        <span className="text-xs">{t("Disconnected")}</span>
      </div>
    );
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
        
        <div className="flex items-center gap-2">
          {getStatusIndicator()}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const timestamp = new Date().toISOString().replace(/:/g, "-");
              const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `system-logs-${timestamp}.json`;
              a.click();
            }}
            disabled={logs.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            {t("Export")}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="live">{t("Live Logs")}</TabsTrigger>
            <TabsTrigger value="history">{t("Historical")}</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="h-4 w-4 absolute top-2.5 left-2 text-gray-400" />
              <Input
                placeholder={t("Search logs...")}
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("Filter")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Levels")}</SelectItem>
                <SelectItem value="info">{t("Info")}</SelectItem>
                <SelectItem value="warning">{t("Warning")}</SelectItem>
                <SelectItem value="error">{t("Error")}</SelectItem>
                <SelectItem value="debug">{t("Debug")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {activeTab === "live" 
                    ? t("Live System Logs") 
                    : t("Historical Logs")}
                </span>
              </div>
              <Badge>
                {activeTab === "live" 
                  ? `${filteredLogs.length} ${t("logs")}`
                  : `${historicalLogs.length} ${t("logs")}`}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
            {/* Live Logs Tab */}
            <TabsContent value="live" className="pt-2 m-0">
              {status === "connected" ? (
                filteredLogs.length > 0 ? (
                  <div>
                    {filteredLogs.map((log) => (
                      <LogItem key={log.id} log={log} />
                    ))}
                    <div ref={logsEndRef} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40">
                    <Terminal className="h-12 w-12 text-gray-500 mb-2" />
                    <p className="text-gray-400">{t("Waiting for logs...")}</p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-40">
                  <WifiOff className="h-12 w-12 text-gray-500 mb-2" />
                  <p className="text-gray-400">{t("Connecting to log service...")}</p>
                  {status === "error" && (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => window.location.reload()}
                    >
                      {t("Reconnect")}
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Historical Logs Tab */}
            <TabsContent value="history" className="pt-2 m-0">
              {isLoadingLogs ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  >
                    <Activity className="h-12 w-12 text-gray-500 mb-2" />
                  </motion.div>
                  <p className="text-gray-400">{t("Loading logs...")}</p>
                </div>
              ) : (
                historicalLogs.length > 0 ? (
                  <div>
                    {historicalLogs.map((log: Log) => (
                      <LogItem key={log.id} log={log} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40">
                    <Terminal className="h-12 w-12 text-gray-500 mb-2" />
                    <p className="text-gray-400">{t("No logs found")}</p>
                  </div>
                )
              )}
              
              {/* Pagination for historical logs */}
              {historicalLogs.length > 0 && (
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
                    disabled={historicalLogs.length < 50}
                  >
                    {t("Next")}
                  </Button>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default RealTimeLogs;
