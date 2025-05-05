
import React, { useState, useEffect, useRef } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { websocketApi } from "@/services/api/endpoints/websocketApi";
import { useWebSocket, ConnectionStatus } from "@/hooks/useWebSocket";
import { WebSocketMessageType } from "@/services/websocketService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileTerminal,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  WifiOff,
  Wifi,
} from "lucide-react";
import { motion } from "framer-motion";

// Log level type
type LogLevel = "info" | "warning" | "error" | "debug" | "all";

// Log entry interface
interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: string;
}

const RealTimeLogs: React.FC = () => {
  const { t } = useLanguageContext();
  const [activeTab, setActiveTab] = useState<"live" | "historical">("live");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [historicalLogs, setHistoricalLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevel>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [authToken, setAuthToken] = useState<string>("");
  const logsEndRef = useRef<HTMLDivElement>(null);
  const maxLogs = 100; // Maximum number of live logs to keep

  // Get WebSocket auth token
  const { data: tokenData, isLoading: isLoadingToken } = useQuery({
    queryKey: ["wsAuthToken"],
    queryFn: async () => {
      try {
        const response = await websocketApi.getAuthToken();
        return response.data;
      } catch (error) {
        console.error("Failed to get WebSocket token:", error);
        toast.error("Failed to get connection token");
        return { token: "" };
      }
    },
  });

  useEffect(() => {
    if (tokenData && tokenData.token) {
      setAuthToken(tokenData.token);
    }
  }, [tokenData]);

  // WebSocket connection for live logs
  const { status: wsStatus, connect: reconnectWs } = useWebSocket<LogEntry>(
    WebSocketMessageType.SYSTEM_LOG,
    (data) => {
      if (data && data.id) {
        setLogs((prevLogs) => {
          const newLogs = [data, ...prevLogs].slice(0, maxLogs);
          return newLogs;
        });
      }
    },
    {
      autoConnect: true,
      authToken,
    }
  );

  // Fetch historical logs
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["systemLogs", page, levelFilter, searchTerm],
    queryFn: async () => {
      try {
        const filters: Record<string, string> = {};
        if (levelFilter !== "all") {
          filters.level = levelFilter;
        }
        if (searchTerm) {
          filters.search = searchTerm;
        }
        
        const response = await websocketApi.getSystemLogs(page, 20, filters);
        return response.data || { logs: [], totalPages: 1 };
      } catch (error) {
        console.error("Failed to fetch historical logs:", error);
        toast.error("Failed to load historical logs");
        return { logs: [], totalPages: 1 };
      }
    },
    enabled: activeTab === "historical",
  });

  // Update historical logs when data changes
  useEffect(() => {
    if (historyData && historyData.logs) {
      setHistoricalLogs(historyData.logs);
      setTotalPages(historyData.totalPages || 1);
    }
  }, [historyData]);

  // Scroll to bottom of live logs when new logs arrive
  useEffect(() => {
    if (activeTab === "live" && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, activeTab]);

  // Toggle expanded state of a log
  const toggleLogExpansion = (id: string) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter logs by level and search term
  const filteredLogs = logs.filter((log) => {
    const matchesLevel = levelFilter === "all" || log.level === levelFilter;
    const matchesSearch = searchTerm
      ? log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.details || "").toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesLevel && matchesSearch;
  });

  // Get status badge variant based on connection status
  const getStatusBadgeVariant = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return "success";
      case "connecting":
        return "warning";
      case "disconnected":
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Get status display text
  const getStatusDisplay = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return t("Connected");
      case "connecting":
        return t("Connecting");
      case "disconnected":
        return t("Disconnected");
      case "error":
        return t("Connection Failed");
      default:
        return t("WebSocket Error");
    }
  };

  // Status Icon component
  const StatusIcon = ({ status }: { status: ConnectionStatus }) => {
    return status === "connected" ? (
      <Wifi className="h-4 w-4 mr-2" />
    ) : (
      <WifiOff className="h-4 w-4 mr-2" />
    );
  };

  // Log badge component for log levels
  const LogBadge = ({ level }: { level: LogLevel }) => {
    let variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | null
      | undefined;
    
    switch (level) {
      case "error":
        variant = "destructive";
        break;
      case "warning":
        variant = "default";
        break;
      case "info":
        variant = "secondary";
        break;
      case "debug":
        variant = "outline";
        break;
      default:
        variant = "secondary";
    }
    
    return (
      <Badge variant={variant} className="text-xs font-normal">
        {level.toUpperCase()}
      </Badge>
    );
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "historical") {
      refetchHistory();
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-chess-text-light">{t("Real-Time Logs")}</h1>
        <p className="text-sm text-chess-text-light/70 mt-1">
          {t("Monitor system activity and troubleshoot issues in real-time")}
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "live" | "historical")}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="live">
              <FileTerminal className="h-4 w-4 mr-2" />
              {t("Live Logs")}
            </TabsTrigger>
            <TabsTrigger value="historical">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("Historical")}
            </TabsTrigger>
          </TabsList>

          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder={t("Search logs...")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={levelFilter} onValueChange={(value) => setLevelFilter(value as LogLevel)}>
              <SelectTrigger className="w-[120px]">
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
          </form>
        </div>

        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>{t("Live System Logs")}</CardTitle>
                <div className="flex items-center">
                  <Badge
                    variant={getStatusBadgeVariant(wsStatus) as any}
                    className="flex items-center mr-4"
                  >
                    <StatusIcon status={wsStatus} />
                    {getStatusDisplay(wsStatus)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={reconnectWs}
                    disabled={wsStatus === "connected" || wsStatus === "connecting"}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t("Reconnect")}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md bg-black/50 h-[500px] overflow-auto p-4 text-sm font-mono">
                {filteredLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <FileTerminal className="h-16 w-16 mb-4 opacity-20" />
                    <p>{wsStatus === "connected" ? t("Waiting for logs...") : t("Connecting to log service...")}</p>
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      className="mb-2 pb-2 border-b border-gray-700"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <LogBadge level={log.level} />
                          <span className="text-gray-400 text-xs">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="text-gray-300 text-xs">[{log.source}]</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleLogExpansion(log.id)}
                        >
                          {expandedLogs[log.id] ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="mt-1 text-chess-text-light whitespace-pre-wrap">
                        {log.message}
                      </div>
                      {expandedLogs[log.id] && log.details && (
                        <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-x-auto">
                          {log.details}
                        </pre>
                      )}
                    </motion.div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>{t("Historical Logs")}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchHistory()}
                  disabled={isLoadingHistory}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("Refresh")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md bg-black/50 h-[500px] overflow-auto p-4 text-sm font-mono">
                {isLoadingHistory ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <RefreshCw className="h-16 w-16 mb-4 opacity-20 animate-spin" />
                    <p>{t("Loading logs...")}</p>
                  </div>
                ) : historicalLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <FileTerminal className="h-16 w-16 mb-4 opacity-20" />
                    <p>{t("No logs found")}</p>
                  </div>
                ) : (
                  historicalLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      className="mb-2 pb-2 border-b border-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-wrap justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <LogBadge level={log.level} />
                          <span className="text-gray-400 text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                          <span className="text-gray-300 text-xs">[{log.source}]</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleLogExpansion(log.id)}
                        >
                          {expandedLogs[log.id] ? (
                            <Minimize2 className="h-4 w-4" />
                          ) : (
                            <Maximize2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="mt-1 text-chess-text-light whitespace-pre-wrap">
                        {log.message}
                      </div>
                      {expandedLogs[log.id] && log.details && (
                        <pre className="mt-2 p-2 bg-gray-800 rounded text-xs overflow-x-auto">
                          {log.details}
                        </pre>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoadingHistory}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t("Previous")}
                  </Button>
                  <span className="text-sm text-chess-text-light">
                    {t("Page")} {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isLoadingHistory}
                  >
                    {t("Next")}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default RealTimeLogs;
