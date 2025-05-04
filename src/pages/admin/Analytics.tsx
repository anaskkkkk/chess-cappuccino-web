import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { analyticsApi } from "@/services/api/endpoints/analyticsApi";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Download,
  Calendar,
  Users,
  Gamepad2,
  ShoppingCart,
  BookOpen,
  BarChart3,
  PieChart as PieChartIcon,
  DownloadCloud,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Analytics = () => {
  const { t } = useLanguageContext();
  const [period, setPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Define chart colors
  const CHART_COLORS = [
    "#8B5CF6", // Purple
    "#D946EF", // Pink
    "#F97316", // Orange
    "#0EA5E9", // Blue
    "#10B981", // Green
    "#F43F5E", // Red
    "#A855F7", // Violet
    "#EC4899", // Pink
    "#EAB308", // Yellow
  ];
  
  // Fetch game analytics data
  const { data: gameData = {}, isLoading: isLoadingGames } = useQuery({
    queryKey: ["gameAnalytics", period],
    queryFn: async () => {
      const response = await analyticsApi.getGameAnalytics(period);
      return response.data || {};
    },
  });
  
  // Fetch user analytics data
  const { data: userData = {}, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["userAnalytics", period],
    queryFn: async () => {
      const response = await analyticsApi.getUserAnalytics(period);
      return response.data || {};
    },
  });
  
  // Fetch store analytics data
  const { data: storeData = {}, isLoading: isLoadingStore } = useQuery({
    queryKey: ["storeAnalytics", period],
    queryFn: async () => {
      const response = await analyticsApi.getStoreAnalytics(period);
      return response.data || {};
    },
  });
  
  // Fetch learning analytics data
  const { data: learningData = {}, isLoading: isLoadingLearning } = useQuery({
    queryKey: ["learningAnalytics", period],
    queryFn: async () => {
      const response = await analyticsApi.getLearningAnalytics(period);
      return response.data || {};
    },
  });
  
  // Handle export analytics
  const handleExportAnalytics = async (type: string, format: 'csv' | 'pdf') => {
    try {
      await analyticsApi.exportAnalytics(type, period, format);
      toast.success(`${t("Analytics exported as")} ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`${t("Export failed")}: ${error.message || t("Please try again")}`);
    }
  };
  
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Mock data for demonstration purposes
  // In a real implementation, this would be replaced with actual API data
  const mockDataReady = true;
  
  // Generate mock overview metrics if data is not available
  const metrics = {
    activeUsers: userData.activeUsers || 8439,
    newUsers: userData.newUsers || 547,
    gamesPlayed: gameData.totalGames || 24893,
    revenue: storeData.revenue || 12950,
    averageGameTime: gameData.averageTime || 18.5,
    completionRate: learningData.completionRate || 78,
    conversionRate: storeData.conversionRate || 3.2,
    retention: userData.retention || 64
  };
  
  // Mock data for charts
  const mockUserData = [
    { name: 'Jan', users: 4000 },
    { name: 'Feb', users: 3000 },
    { name: 'Mar', users: 5000 },
    { name: 'Apr', users: 4500 },
    { name: 'May', users: 6000 },
    { name: 'Jun', users: 4800 },
    { name: 'Jul', users: 7000 },
  ];
  
  const mockGameData = [
    { name: 'Jan', games: 3900, tournaments: 650 },
    { name: 'Feb', games: 3100, tournaments: 700 },
    { name: 'Mar', games: 5100, tournaments: 800 },
    { name: 'Apr', games: 4300, tournaments: 850 },
    { name: 'May', games: 5900, tournaments: 900 },
    { name: 'Jun', games: 4700, tournaments: 950 },
    { name: 'Jul', games: 7100, tournaments: 1000 },
  ];
  
  const mockRevenueData = [
    { name: 'Jan', revenue: 5000 },
    { name: 'Feb', revenue: 4000 },
    { name: 'Mar', revenue: 6000 },
    { name: 'Apr', revenue: 5500 },
    { name: 'May', revenue: 7000 },
    { name: 'Jun', revenue: 8000 },
    { name: 'Jul', revenue: 9000 },
  ];
  
  const mockPieData = [
    { name: 'SmartBoards', value: 40 },
    { name: 'Courses', value: 30 },
    { name: 'Accessories', value: 20 },
    { name: 'Memberships', value: 10 },
  ];
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-chess-text-light">{t("Analytics")}</h1>
          <p className="text-sm text-chess-text-light/70 mt-1">
            {t("Track platform usage, revenue, and user engagement metrics")}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32 h-9">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("Period")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{t("Today")}</SelectItem>
              <SelectItem value="week">{t("This Week")}</SelectItem>
              <SelectItem value="month">{t("This Month")}</SelectItem>
              <SelectItem value="quarter">{t("This Quarter")}</SelectItem>
              <SelectItem value="year">{t("This Year")}</SelectItem>
              <SelectItem value="all">{t("All Time")}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="ml-0 sm:ml-2 flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>{t("Refresh")}</span>
          </Button>
          
          <Select>
            <SelectTrigger className="w-32 h-9">
              <DownloadCloud className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("Export")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv" onClick={() => handleExportAnalytics(activeTab, 'csv')}>
                {t("Export as CSV")}
              </SelectItem>
              <SelectItem value="pdf" onClick={() => handleExportAnalytics(activeTab, 'pdf')}>
                {t("Export as PDF")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4 bg-transparent">
          <TabsTrigger value="overview" className="data-[state=active]:bg-chess-accent data-[state=active]:text-white data-[state=active]:shadow">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t("Overview")}
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-chess-accent data-[state=active]:text-white data-[state=active]:shadow">
            <Users className="h-4 w-4 mr-2" />
            {t("Users")}
          </TabsTrigger>
          <TabsTrigger value="games" className="data-[state=active]:bg-chess-accent data-[state=active]:text-white data-[state=active]:shadow">
            <Gamepad2 className="h-4 w-4 mr-2" />
            {t("Games")}
          </TabsTrigger>
          <TabsTrigger value="store" className="data-[state=active]:bg-chess-accent data-[state=active]:text-white data-[state=active]:shadow">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t("Store")}
          </TabsTrigger>
          <TabsTrigger value="learning" className="data-[state=active]:bg-chess-accent data-[state=active]:text-white data-[state=active]:shadow">
            <BookOpen className="h-4 w-4 mr-2" />
            {t("Learning")}
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-chess-text-light/70">{t("Active Users")}</p>
                    <h3 className="text-2xl font-bold text-chess-text-light mt-1">{formatNumber(metrics.activeUsers)}</h3>
                  </div>
                  <Users className="h-8 w-8 text-chess-accent opacity-80" />
                </div>
                <div className="mt-2 text-xs text-green-500">
                  +{metrics.newUsers} {t("new users")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-chess-text-light/70">{t("Games Played")}</p>
                    <h3 className="text-2xl font-bold text-chess-text-light mt-1">{formatNumber(metrics.gamesPlayed)}</h3>
                  </div>
                  <Gamepad2 className="h-8 w-8 text-chess-accent opacity-80" />
                </div>
                <div className="mt-2 text-xs text-chess-text-light/70">
                  {t("Avg Time")}: {metrics.averageGameTime} {t("min")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-chess-text-light/70">{t("Revenue")}</p>
                    <h3 className="text-2xl font-bold text-chess-text-light mt-1">${formatNumber(metrics.revenue)}</h3>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-chess-accent opacity-80" />
                </div>
                <div className="mt-2 text-xs text-chess-text-light/70">
                  {t("Conversion Rate")}: {metrics.conversionRate}%
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-chess-text-light/70">{t("Course Completion")}</p>
                    <h3 className="text-2xl font-bold text-chess-text-light mt-1">{metrics.completionRate}%</h3>
                  </div>
                  <BookOpen className="h-8 w-8 text-chess-accent opacity-80" />
                </div>
                <div className="mt-2 text-xs text-chess-text-light/70">
                  {t("User Retention")}: {metrics.retention}%
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("User Growth")}</CardTitle>
                <CardDescription>
                  {t("Active users over time")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userData.growth || mockUserData}
                      margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2c2c2c" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333' }}
                        itemStyle={{ color: '#f1f1f1' }}
                      />
                      <Line type="monotone" dataKey="users" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("Game Activity")}</CardTitle>
                <CardDescription>
                  {t("Games and tournaments played")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={gameData.activity || mockGameData}
                      margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2c2c2c" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333' }}
                        itemStyle={{ color: '#f1f1f1' }}
                      />
                      <Legend />
                      <Bar dataKey="games" name={t("Games")} fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="tournaments" name={t("Tournaments")} fill="#D946EF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t("Revenue Trend")}</CardTitle>
                <CardDescription>
                  {t("Monthly revenue from all sources")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={storeData.revenue || mockRevenueData}
                      margin={{
                        top: 5,
                        right: 20,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2c2c2c" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333' }}
                        itemStyle={{ color: '#f1f1f1' }}
                        formatter={(value: any) => [`$${value}`, t("Revenue")]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#8B5CF6" 
                        fillOpacity={1}
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("Revenue Sources")}</CardTitle>
                <CardDescription>
                  {t("Revenue breakdown by product category")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 flex items-center justify-center">
                <div className="h-64 w-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={storeData.sources || mockPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {(storeData.sources || mockPieData).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f1f1f', border: '1px solid #333' }}
                        itemStyle={{ color: '#f1f1f1' }}
                        formatter={(value: any) => [`${value}%`, t("Percentage")]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Other tabs would be implemented similarly with their specific charts and metrics */}
        <TabsContent value="users">
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <h3 className="text-xl text-chess-text-light">{t("User Analytics")}</h3>
            <p className="text-sm text-chess-text-light/70 mt-2">
              {t("Detailed user analytics available in the full implementation")}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="games">
          <div className="text-center py-12">
            <Gamepad2 className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <h3 className="text-xl text-chess-text-light">{t("Game Analytics")}</h3>
            <p className="text-sm text-chess-text-light/70 mt-2">
              {t("Detailed game analytics available in the full implementation")}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="store">
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <h3 className="text-xl text-chess-text-light">{t("Store Analytics")}</h3>
            <p className="text-sm text-chess-text-light/70 mt-2">
              {t("Detailed store analytics available in the full implementation")}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="learning">
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <h3 className="text-xl text-chess-text-light">{t("Learning Analytics")}</h3>
            <p className="text-sm text-chess-text-light/70 mt-2">
              {t("Detailed learning analytics available in the full implementation")}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
