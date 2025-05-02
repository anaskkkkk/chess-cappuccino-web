
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  HardDrive, 
  Search, 
  Filter, 
  MoreHorizontal, 
  RefreshCw, 
  Power, 
  User, 
  MapPin, 
  Activity, 
  Wifi, 
  WifiOff, 
  Bell, 
  Terminal, 
  Download, 
  Settings, 
  BarChart4
} from "lucide-react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { smartBoardApi } from "@/services/api/apiEndpoints";

// Mock data for UI development
const mockBoards = [
  { 
    id: "SB-100123", 
    name: "Smart Board #1", 
    serialNumber: "SBXN-45678-A", 
    status: "online", 
    lastSeen: "2025-05-01T10:30:00Z", 
    firmwareVersion: "v2.1.5",
    batteryLevel: 85,
    wifiStrength: 90,
    location: "New York Chess Club",
    paired: true,
    pairedWith: "USR-505",
    pairedUserName: "John Smith",
    games: 42,
    lastGameId: "GAME-78912",
    ipAddress: "192.168.1.105",
  },
  { 
    id: "SB-100124", 
    name: "Smart Board #2", 
    serialNumber: "SBXN-45679-B", 
    status: "offline", 
    lastSeen: "2025-04-28T16:45:00Z", 
    firmwareVersion: "v2.1.5",
    batteryLevel: 20,
    wifiStrength: 0,
    location: "Chicago Chess Center",
    paired: true,
    pairedWith: "USR-212",
    pairedUserName: "Sarah Johnson",
    games: 36,
    lastGameId: "GAME-78521",
    ipAddress: "192.168.1.106",
  },
  { 
    id: "SB-100125", 
    name: "Smart Board #3", 
    serialNumber: "SBXN-45680-C", 
    status: "idle", 
    lastSeen: "2025-05-01T08:15:00Z", 
    firmwareVersion: "v2.1.5",
    batteryLevel: 72,
    wifiStrength: 65,
    location: "London Chess Academy",
    paired: false,
    pairedWith: null,
    pairedUserName: null,
    games: 18,
    lastGameId: "GAME-76123",
    ipAddress: "192.168.1.107",
  },
  { 
    id: "SB-100126", 
    name: "Smart Board #4", 
    serialNumber: "SBXN-45681-D", 
    status: "updating", 
    lastSeen: "2025-05-01T09:45:00Z", 
    firmwareVersion: "v2.1.4",
    batteryLevel: 65,
    wifiStrength: 85,
    location: "Berlin Chess Club",
    paired: true,
    pairedWith: "USR-128",
    pairedUserName: "Mohammed Al-Farsi",
    games: 29,
    lastGameId: "GAME-77452",
    ipAddress: "192.168.1.108",
  },
  { 
    id: "SB-100127", 
    name: "Smart Board #5", 
    serialNumber: "SBXN-45682-E", 
    status: "error", 
    lastSeen: "2025-04-30T14:20:00Z", 
    firmwareVersion: "v2.1.5",
    batteryLevel: 54,
    wifiStrength: 40,
    location: "Tokyo Chess Association",
    paired: true,
    pairedWith: "USR-309",
    pairedUserName: "Yuki Tanaka",
    games: 15,
    lastGameId: "GAME-75998",
    ipAddress: "192.168.1.109",
  }
];

// Mock logs for UI development
const mockLogs = [
  { timestamp: "2025-05-01T10:30:00Z", level: "info", message: "Board connected to WiFi network", boardId: "SB-100123" },
  { timestamp: "2025-05-01T10:25:12Z", level: "error", message: "Sensor calibration failed", boardId: "SB-100127" },
  { timestamp: "2025-05-01T09:45:00Z", level: "info", message: "OTA update started", boardId: "SB-100126" },
  { timestamp: "2025-05-01T08:15:00Z", level: "warning", message: "Battery level below 30%", boardId: "SB-100124" },
  { timestamp: "2025-05-01T08:12:32Z", level: "info", message: "Game session started", boardId: "SB-100123" },
  { timestamp: "2025-04-30T23:45:18Z", level: "error", message: "Connection lost", boardId: "SB-100124" },
  { timestamp: "2025-04-30T20:30:45Z", level: "info", message: "Firmware updated to v2.1.5", boardId: "SB-100123" },
  { timestamp: "2025-04-30T18:20:10Z", level: "warning", message: "Weak WiFi signal detected", boardId: "SB-100127" },
];

const SmartBoardFleet = () => {
  const { t } = useLanguageContext();
  const [boards, setBoards] = useState(mockBoards);
  const [logs, setLogs] = useState(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedBoard, setSelectedBoard] = useState<any>(null);
  const [isBoardDetailsOpen, setIsBoardDetailsOpen] = useState(false);
  const [selectedBoardLogs, setSelectedBoardLogs] = useState<any[]>([]);
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);
  const [isOTADialogOpen, setIsOTADialogOpen] = useState(false);
  const [firmwareVersion, setFirmwareVersion] = useState("v2.1.5");

  // TODO: API - Fetch boards
  const fetchBoards = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await smartBoardApi.getAllBoards();
      // return response;
      return mockBoards;
    } catch (error) {
      console.error("Error fetching boards:", error);
      toast({
        title: "Error",
        description: "Failed to fetch smart boards",
        variant: "destructive",
      });
      return [];
    }
  };

  // Query for fetching boards
  const { data: boardsData, isLoading } = useQuery({
    queryKey: ['smart-boards'],
    queryFn: fetchBoards,
    // Disabled for now to use mock data
    enabled: false,
  });

  // View board details
  const handleViewBoardDetails = (board: any) => {
    setSelectedBoard(board);
    setIsBoardDetailsOpen(true);
  };

  // View board logs
  const handleViewBoardLogs = async (boardId: string) => {
    try {
      // TODO: API - Fetch board logs
      // const logsData = await smartBoardApi.getBoardLogs(boardId);
      // setSelectedBoardLogs(logsData);
      
      // For now, use filtered mock logs
      const filteredLogs = logs.filter(log => log.boardId === boardId);
      setSelectedBoardLogs(filteredLogs);
      setIsLogsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching board logs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch board logs",
        variant: "destructive",
      });
    }
  };

  // Remote reset board
  const handleRemoteReset = async (boardId: string) => {
    try {
      // TODO: API - Remote reset board
      // await smartBoardApi.remoteResetSmartBoard(boardId);
      
      toast({
        title: "Success",
        description: "Remote reset command sent successfully",
      });
    } catch (error) {
      console.error("Error sending remote reset:", error);
      toast({
        title: "Error",
        description: "Failed to send remote reset command",
        variant: "destructive",
      });
    }
  };

  // Push OTA update
  const handlePushOTA = async (boardId: string, version: string) => {
    try {
      // TODO: API - Push OTA update
      // await smartBoardApi.pushOTAUpdate(boardId, version);
      
      setBoards(boards.map(board => 
        board.id === boardId 
          ? { ...board, status: "updating" } 
          : board
      ));
      
      setIsOTADialogOpen(false);
      toast({
        title: "Success",
        description: `OTA update to ${version} initiated`,
      });
      
      // Simulate update completion after 5 seconds
      setTimeout(() => {
        setBoards(boards.map(board => 
          board.id === boardId 
            ? { ...board, status: "online", firmwareVersion: version } 
            : board
        ));
        
        toast({
          title: "Update Complete",
          description: `Board ${boardId} updated to ${version}`,
        });
      }, 5000);
    } catch (error) {
      console.error("Error pushing OTA update:", error);
      toast({
        title: "Error",
        description: "Failed to push OTA update",
        variant: "destructive",
      });
    }
  };

  // Filter boards based on search and status filter
  const filteredBoards = boards.filter(board => {
    const matchesSearch = board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          board.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          board.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === "" || board.status === statusFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Online boards count
  const onlineBoards = boards.filter(board => board.status === "online" || board.status === "idle").length;
  
  // Offline boards count
  const offlineBoards = boards.filter(board => board.status === "offline").length;
  
  // Boards with issues count
  const issueBoards = boards.filter(board => board.status === "error").length;
  
  // Unpaired boards count
  const unpairedBoards = boards.filter(board => !board.paired).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <HardDrive className="h-6 w-6 text-chess-accent" />
          <h2 className="text-2xl font-bold">{t("SmartBoard Fleet")}</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("Total Boards")}</CardDescription>
            <CardTitle className="text-2xl">{boards.length}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              {onlineBoards} {t("online")}, {offlineBoards} {t("offline")}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("Active Games")}</CardDescription>
            <CardTitle className="text-2xl">3</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              {t("Last game started 5 minutes ago")}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("Issues")}</CardDescription>
            <CardTitle className="text-2xl">{issueBoards}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              {t("Requires attention")}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{t("Unpaired")}</CardDescription>
            <CardTitle className="text-2xl">{unpairedBoards}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground">
              {t("Available for pairing")}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-chess-beige-100 rounded-md p-4">
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">{t("All Boards")}</TabsTrigger>
              <TabsTrigger value="online">{t("Online")}</TabsTrigger>
              <TabsTrigger value="offline">{t("Offline")}</TabsTrigger>
              <TabsTrigger value="issues">{t("Issues")}</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  placeholder={t("Search boards...")} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                />
              </div>
              
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder={t("All statuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("All statuses")}</SelectItem>
                  <SelectItem value="online">{t("Online")}</SelectItem>
                  <SelectItem value="offline">{t("Offline")}</SelectItem>
                  <SelectItem value="idle">{t("Idle")}</SelectItem>
                  <SelectItem value="updating">{t("Updating")}</SelectItem>
                  <SelectItem value="error">{t("Error")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableCaption>{t("A list of all smart boards")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Name")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("Serial Number")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("Last Seen")}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t("Firmware")}</TableHead>
                    <TableHead className="text-right">{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 border-2 border-t-chess-accent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{t("Loading boards...")}</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredBoards.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <p className="text-gray-500">{t("No boards found")}</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBoards.map((board) => (
                      <TableRow key={board.id} className={board.status === "error" ? "bg-red-50" : ""}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {board.status === "online" && <Wifi className="h-4 w-4 text-green-500" />}
                            {board.status === "offline" && <WifiOff className="h-4 w-4 text-gray-500" />}
                            {board.status === "idle" && <Wifi className="h-4 w-4 text-blue-500" />}
                            {board.status === "updating" && <RefreshCw className="h-4 w-4 text-amber-500" />}
                            {board.status === "error" && <Bell className="h-4 w-4 text-red-500" />}
                            {board.name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{board.serialNumber}</TableCell>
                        <TableCell>
                          <Badge variant={
                            board.status === 'online' ? 'default' : 
                            board.status === 'offline' ? 'outline' :
                            board.status === 'idle' ? 'secondary' :
                            board.status === 'updating' ? 'secondary' :
                            'destructive'
                          }>
                            {t(board.status.charAt(0).toUpperCase() + board.status.slice(1))}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(board.lastSeen)}</TableCell>
                        <TableCell className="hidden sm:table-cell">{board.firmwareVersion}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">{t("Actions")}</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewBoardDetails(board)}>
                                <HardDrive className="h-4 w-4 mr-2" /> {t("View Details")}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewBoardLogs(board.id)}>
                                <Terminal className="h-4 w-4 mr-2" /> {t("View Logs")}
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              {(board.status !== 'offline') && (
                                <DropdownMenuItem onClick={() => handleRemoteReset(board.id)}>
                                  <Power className="h-4 w-4 mr-2" /> {t("Remote Reset")}
                                </DropdownMenuItem>
                              )}
                              
                              {(board.status !== 'offline' && board.status !== 'updating') && (
                                <DropdownMenuItem onClick={() => {
                                  setSelectedBoard(board);
                                  setIsOTADialogOpen(true);
                                }}>
                                  <RefreshCw className="h-4 w-4 mr-2" /> {t("Push OTA Update")}
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" /> {t("Configure")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="online">
            {/* Similar table as above but filtered for online boards */}
            <div className="rounded-md border">
              <Table>
                <TableCaption>{t("Online smart boards")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Name")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("Serial Number")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("Last Seen")}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t("Firmware")}</TableHead>
                    <TableHead className="text-right">{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boards.filter(board => board.status === "online" || board.status === "idle").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <p className="text-gray-500">{t("No online boards found")}</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    boards.filter(board => board.status === "online" || board.status === "idle").map((board) => (
                      <TableRow key={board.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {board.status === "online" && <Wifi className="h-4 w-4 text-green-500" />}
                            {board.status === "idle" && <Wifi className="h-4 w-4 text-blue-500" />}
                            {board.name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{board.serialNumber}</TableCell>
                        <TableCell>
                          <Badge variant={board.status === 'online' ? 'default' : 'secondary'}>
                            {t(board.status.charAt(0).toUpperCase() + board.status.slice(1))}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(board.lastSeen)}</TableCell>
                        <TableCell className="hidden sm:table-cell">{board.firmwareVersion}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewBoardDetails(board)}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="offline">
            {/* Similar table as above but filtered for offline boards */}
            <div className="rounded-md border">
              <Table>
                <TableCaption>{t("Offline smart boards")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Name")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("Serial Number")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("Last Seen")}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t("Firmware")}</TableHead>
                    <TableHead className="text-right">{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boards.filter(board => board.status === "offline").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <p className="text-gray-500">{t("No offline boards found")}</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    boards.filter(board => board.status === "offline").map((board) => (
                      <TableRow key={board.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <WifiOff className="h-4 w-4 text-gray-500" />
                            {board.name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{board.serialNumber}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {t(board.status.charAt(0).toUpperCase() + board.status.slice(1))}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(board.lastSeen)}</TableCell>
                        <TableCell className="hidden sm:table-cell">{board.firmwareVersion}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewBoardDetails(board)}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="issues">
            {/* Similar table as above but filtered for boards with issues */}
            <div className="rounded-md border">
              <Table>
                <TableCaption>{t("Smart boards with issues")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Name")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("Serial Number")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("Last Seen")}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t("Firmware")}</TableHead>
                    <TableHead className="text-right">{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {boards.filter(board => board.status === "error").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        <p className="text-gray-500">{t("No boards with issues found")}</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    boards.filter(board => board.status === "error").map((board) => (
                      <TableRow key={board.id} className="bg-red-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-red-500" />
                            {board.name}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{board.serialNumber}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {t(board.status.charAt(0).toUpperCase() + board.status.slice(1))}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{formatDate(board.lastSeen)}</TableCell>
                        <TableCell className="hidden sm:table-cell">{board.firmwareVersion}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewBoardDetails(board)}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Board Details Dialog */}
      <Dialog open={isBoardDetailsOpen} onOpenChange={setIsBoardDetailsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("Board Details")}</DialogTitle>
            <DialogDescription>
              {selectedBoard && `${selectedBoard.name} - ${selectedBoard.serialNumber}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBoard && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">{t("Status")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      {selectedBoard.status === "online" && <Wifi className="h-5 w-5 text-green-500" />}
                      {selectedBoard.status === "offline" && <WifiOff className="h-5 w-5 text-gray-500" />}
                      {selectedBoard.status === "idle" && <Wifi className="h-5 w-5 text-blue-500" />}
                      {selectedBoard.status === "updating" && <RefreshCw className="h-5 w-5 text-amber-500" />}
                      {selectedBoard.status === "error" && <Bell className="h-5 w-5 text-red-500" />}
                      <span className="font-medium">
                        {t(selectedBoard.status.charAt(0).toUpperCase() + selectedBoard.status.slice(1))}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {t("Last seen")}: {formatDate(selectedBoard.lastSeen)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">{t("Battery")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            selectedBoard.batteryLevel > 60 ? 'bg-green-500' : 
                            selectedBoard.batteryLevel > 30 ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`} 
                          style={{ width: `${selectedBoard.batteryLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedBoard.batteryLevel}%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-500">{t("WiFi")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${
                            selectedBoard.wifiStrength > 60 ? 'bg-green-500' : 
                            selectedBoard.wifiStrength > 30 ? 'bg-amber-500' : 
                            'bg-red-500'
                          }`} 
                          style={{ width: `${selectedBoard.wifiStrength}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{selectedBoard.wifiStrength}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">{t("Board Information")}</h4>
                  <div className="rounded-md border p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{t("ID")}:</span>
                      <span className="text-sm font-medium">{selectedBoard.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{t("Firmware Version")}:</span>
                      <span className="text-sm font-medium">{selectedBoard.firmwareVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{t("IP Address")}:</span>
                      <span className="text-sm font-medium">{selectedBoard.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{t("Location")}:</span>
                      <span className="text-sm font-medium">{selectedBoard.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{t("Games Played")}:</span>
                      <span className="text-sm font-medium">{selectedBoard.games}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">{t("Last Game ID")}:</span>
                      <span className="text-sm font-medium">{selectedBoard.lastGameId}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">{t("Pairing Status")}</h4>
                  <div className="rounded-md border p-3">
                    {selectedBoard.paired ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-chess-accent" />
                          <span className="font-medium">{t("Paired with User")}</span>
                        </div>
                        <div className="pl-6 space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-500">{t("User ID")}: </span>
                            {selectedBoard.pairedWith}
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">{t("User Name")}: </span>
                            {selectedBoard.pairedUserName}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full"
                        >
                          {t("Unpair Board")}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{t("Not Paired")}</span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {t("This board is not paired with any user")}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full"
                        >
                          {t("Pair with User")}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-medium mt-4 mb-2">{t("Location")}</h4>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-chess-accent" />
                      <span className="font-medium">{selectedBoard.location}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                    >
                      {t("Update Location")}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleViewBoardLogs(selectedBoard.id)}
                  className="bg-chess-accent hover:bg-chess-accent/90"
                >
                  <Terminal className="h-4 w-4 mr-2" /> {t("View Logs")}
                </Button>
                
                {selectedBoard.status !== 'offline' && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleRemoteReset(selectedBoard.id)}
                  >
                    <Power className="h-4 w-4 mr-2" /> {t("Remote Reset")}
                  </Button>
                )}
                
                {(selectedBoard.status !== 'offline' && selectedBoard.status !== 'updating') && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsOTADialogOpen(true);
                      setIsBoardDetailsOpen(false);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" /> {t("Push OTA Update")}
                  </Button>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsBoardDetailsOpen(false)}
                >
                  {t("Close")}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Logs Dialog */}
      <Dialog open={isLogsDialogOpen} onOpenChange={setIsLogsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("Board Logs")}</DialogTitle>
            <DialogDescription>
              {selectedBoard && `${selectedBoard.name} - ${selectedBoard.serialNumber}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">{t("Recent Logs")}</h4>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> {t("Download Full Logs")}
              </Button>
            </div>
            
            <ScrollArea className="h-[400px] border rounded-md p-2">
              {selectedBoardLogs.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">{t("No logs available")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedBoardLogs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded-md text-sm ${
                        log.level === 'error' ? 'bg-red-50 border border-red-200' : 
                        log.level === 'warning' ? 'bg-amber-50 border border-amber-200' : 
                        'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          log.level === 'error' ? 'bg-red-100 text-red-800' : 
                          log.level === 'warning' ? 'bg-amber-100 text-amber-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(log.timestamp)}</span>
                      </div>
                      <p className="mt-1">{log.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsLogsDialogOpen(false)}
              >
                {t("Close")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* OTA Update Dialog */}
      <Dialog open={isOTADialogOpen} onOpenChange={setIsOTADialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("Push OTA Update")}</DialogTitle>
            <DialogDescription>
              {selectedBoard && `${selectedBoard.name} - ${selectedBoard.serialNumber}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t("Current Firmware Version")}</h4>
              <div className="bg-gray-50 border rounded-md p-3">
                {selectedBoard?.firmwareVersion || ""}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t("Select Firmware Version")}</h4>
              <Select 
                value={firmwareVersion} 
                onValueChange={setFirmwareVersion}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v2.1.5">v2.1.5 (Latest)</SelectItem>
                  <SelectItem value="v2.1.4">v2.1.4</SelectItem>
                  <SelectItem value="v2.1.3">v2.1.3</SelectItem>
                  <SelectItem value="v2.0.9">v2.0.9 (Stable)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
              <p className="text-sm text-amber-800">
                <span className="font-medium">{t("Warning")}: </span>
                {t("The board will be unavailable during the update process. Make sure no game is in progress.")}
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsOTADialogOpen(false)}
              >
                {t("Cancel")}
              </Button>
              <Button 
                className="bg-chess-accent hover:bg-chess-accent/90"
                onClick={() => {
                  if (selectedBoard) {
                    handlePushOTA(selectedBoard.id, firmwareVersion);
                  }
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> {t("Push Update")}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmartBoardFleet;
