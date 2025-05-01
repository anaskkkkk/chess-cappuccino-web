
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { 
  Users, 
  Gamepad, 
  Trophy, 
  BookOpen, 
  ShoppingCart, 
  HardDrive,
  ArrowUpRight,
  Activity,
  Bell,
  AlertTriangle
} from "lucide-react";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const Dashboard = () => {
  const { t } = useLanguageContext();

  // Sample data for charts
  const userActivityData = [
    { name: 'Jan', active: 4000, new: 2400 },
    { name: 'Feb', active: 3000, new: 1398 },
    { name: 'Mar', active: 2000, new: 9800 },
    { name: 'Apr', active: 2780, new: 3908 },
    { name: 'May', active: 1890, new: 4800 },
    { name: 'Jun', active: 2390, new: 3800 },
    { name: 'Jul', active: 3490, new: 4300 },
  ];

  const gameStatsData = [
    { name: 'Mon', games: 120 },
    { name: 'Tue', games: 150 },
    { name: 'Wed', games: 200 },
    { name: 'Thu', games: 180 },
    { name: 'Fri', games: 250 },
    { name: 'Sat', games: 320 },
    { name: 'Sun', games: 280 },
  ];

  const revenueData = [
    { name: 'Courses', value: 45 },
    { name: 'Boards', value: 30 },
    { name: 'Merch', value: 15 },
    { name: 'Subs', value: 10 },
  ];

  const COLORS = ['#B79A7A', '#D1BA9F', '#E8DCC9', '#8A7355'];

  const statCards = [
    { title: 'Total Users', value: '14,586', icon: Users, change: '+12%', color: 'bg-blue-600' },
    { title: 'Active Games', value: '243', icon: Gamepad, change: '+5%', color: 'bg-green-500' },
    { title: 'Tournaments', value: '18', icon: Trophy, change: '-2%', color: 'bg-amber-500' },
    { title: 'Courses', value: '24', icon: BookOpen, change: '+8%', color: 'bg-purple-500' },
    { title: 'Revenue', value: '$24,320', icon: ShoppingCart, change: '+15%', color: 'bg-chess-accent' },
    { title: 'Connected Boards', value: '126', icon: HardDrive, change: '+3%', color: 'bg-red-500' },
  ];

  const alerts = [
    { title: 'System Update', description: 'New update available (v2.4)', icon: Activity, color: 'bg-blue-500' },
    { title: 'High Traffic', description: 'Unusual activity detected', icon: AlertTriangle, color: 'bg-amber-500' },
    { title: 'New Reports', description: '5 new reports available', icon: Bell, color: 'bg-chess-accent' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-chess-text-light">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card, index) => (
            <Card key={index} className="bg-chess-dark border border-white/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-chess-text-light text-lg">{card.title}</CardTitle>
                  <div className={`p-2 rounded-full ${card.color}`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-chess-text-light">{card.value}</div>
                <p className={`text-sm ${card.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} flex items-center mt-1`}>
                  {card.change}
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                  <span className="text-gray-400 ml-1">vs last month</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-chess-dark border border-white/10">
          <CardHeader>
            <CardTitle className="text-chess-text-light">User Activity</CardTitle>
            <CardDescription className="text-gray-400">Active vs new users over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: "#E8DCC9" }} />
                  <YAxis tick={{ fill: "#E8DCC9" }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#222", 
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#E8DCC9"
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="active" name="Active Users" fill="#B79A7A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="new" name="New Users" fill="#E8DCC9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-chess-dark border border-white/10">
          <CardHeader>
            <CardTitle className="text-chess-text-light">Games Played</CardTitle>
            <CardDescription className="text-gray-400">Weekly games played</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gameStatsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: "#E8DCC9" }} />
                  <YAxis tick={{ fill: "#E8DCC9" }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#222", 
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#E8DCC9"
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="games" stroke="#B79A7A" strokeWidth={2} dot={{ fill: "#B79A7A", strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Revenue + Alerts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-chess-dark border border-white/10 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-chess-text-light">Revenue Breakdown</CardTitle>
            <CardDescription className="text-gray-400">Revenue by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: "#222", 
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#E8DCC9"
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Detailed Report</Button>
          </CardFooter>
        </Card>

        <Card className="bg-chess-dark border border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-chess-text-light">System Alerts</CardTitle>
            <CardDescription className="text-gray-400">Recent notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className={`p-2 rounded-full ${alert.color}`}>
                  <alert.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-chess-text-light font-medium">{alert.title}</h4>
                  <p className="text-sm text-gray-400">{alert.description}</p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Alerts</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
