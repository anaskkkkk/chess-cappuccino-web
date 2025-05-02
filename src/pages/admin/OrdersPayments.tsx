
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Package, 
  RefreshCw,
  Ban,
  Download,
  FileText,
  Truck,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  BarChart4
} from "lucide-react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { storeApi } from "@/services/api/apiEndpoints";

// Mock data for UI development
const mockOrders = [
  { 
    id: "ORD-1001", 
    customerId: "USR-505", 
    customerName: "John Smith",
    date: "2025-04-28T16:30:00Z", 
    total: 249.99, 
    status: "completed", 
    paymentStatus: "paid", 
    paymentMethod: "credit-card",
    items: [
      { id: "PRD-001", name: "Smart Chess Board", quantity: 1, price: 199.99 },
      { id: "PRD-025", name: "Premium Pieces Set", quantity: 1, price: 50.00 }
    ]
  },
  { 
    id: "ORD-1002", 
    customerId: "USR-212", 
    customerName: "Sarah Johnson",
    date: "2025-04-27T09:45:00Z", 
    total: 29.99, 
    status: "processing", 
    paymentStatus: "paid", 
    paymentMethod: "paypal",
    items: [
      { id: "PRD-015", name: "3-Month Premium Subscription", quantity: 1, price: 29.99 }
    ]
  },
  { 
    id: "ORD-1003", 
    customerId: "USR-128", 
    customerName: "Mohammed Al-Farsi",
    date: "2025-04-25T12:15:00Z", 
    total: 375.00, 
    status: "shipped", 
    paymentStatus: "paid", 
    paymentMethod: "credit-card",
    items: [
      { id: "PRD-001", name: "Smart Chess Board", quantity: 1, price: 199.99 },
      { id: "PRD-008", name: "Advanced Chess Course Bundle", quantity: 1, price: 149.99 },
      { id: "PRD-032", name: "Chess Clock", quantity: 1, price: 25.02 }
    ]
  },
  { 
    id: "ORD-1004", 
    customerId: "USR-053", 
    customerName: "Elena Petrova",
    date: "2025-04-24T18:20:00Z", 
    total: 199.99, 
    status: "pending", 
    paymentStatus: "awaiting", 
    paymentMethod: "bank-transfer",
    items: [
      { id: "PRD-001", name: "Smart Chess Board", quantity: 1, price: 199.99 }
    ]
  },
  { 
    id: "ORD-1005", 
    customerId: "USR-309", 
    customerName: "Carlos Rodriguez",
    date: "2025-04-20T10:30:00Z", 
    total: 75.98, 
    status: "cancelled", 
    paymentStatus: "refunded", 
    paymentMethod: "credit-card",
    items: [
      { id: "PRD-012", name: "Annual Subscription", quantity: 1, price: 75.98 }
    ]
  }
];

// Revenue data for charts
const mockRevenueData = [
  { date: "Apr 24", revenue: 299.99 },
  { date: "Apr 25", revenue: 525.00 },
  { date: "Apr 26", revenue: 150.00 },
  { date: "Apr 27", revenue: 429.98 },
  { date: "Apr 28", revenue: 649.99 },
  { date: "Apr 29", revenue: 299.99 },
  { date: "Apr 30", revenue: 175.50 }
];

const OrdersPayments = () => {
  const { t } = useLanguageContext();
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("orders");

  // TODO: API - Fetch orders
  const fetchOrders = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await storeApi.getOrders();
      // return response;
      return mockOrders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
      return [];
    }
  };

  // Query for fetching orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    // Disabled for now to use mock data
    enabled: false,
  });

  // View order details
  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      // TODO: API - Update order status
      // await storeApi.updateOrderStatus(orderId, status);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status } 
          : order
      ));
      
      toast({
        title: "Success",
        description: `Order status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // Process refund
  const handleProcessRefund = async (orderId: string) => {
    try {
      // TODO: API - Process refund
      // await storeApi.refundOrder(orderId);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: "refunded", paymentStatus: "refunded" } 
          : order
      ));
      
      toast({
        title: "Success",
        description: "Refund processed successfully",
      });
    } catch (error) {
      console.error("Error processing refund:", error);
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    }
  };

  // Filter orders based on search and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === "" || order.status === statusFilter;
    
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

  // Calculate total revenue
  const totalRevenue = orders
    .filter(order => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0);
  
  // Calculate pending revenue
  const pendingRevenue = orders
    .filter(order => order.paymentStatus === "awaiting")
    .reduce((sum, order) => sum + order.total, 0);

  // Calculate total orders
  const totalOrders = orders.length;
  
  // Calculate completed orders
  const completedOrders = orders.filter(order => 
    order.status === "completed" || order.status === "shipped"
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-6 w-6 text-chess-accent" />
          <h2 className="text-2xl font-bold">{t("Orders & Payments")}</h2>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="orders">{t("Orders")}</TabsTrigger>
          <TabsTrigger value="payments">{t("Payments")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("Analytics")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Total Orders")}</CardDescription>
                <CardTitle className="text-2xl">{totalOrders}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  {completedOrders} {t("completed")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Total Revenue")}</CardDescription>
                <CardTitle className="text-2xl">${totalRevenue.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  ${pendingRevenue.toFixed(2)} {t("pending")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Popular Product")}</CardDescription>
                <CardTitle className="text-lg">Smart Chess Board</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  {t("Ordered")} 3 {t("times this week")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Processing Time")}</CardDescription>
                <CardTitle className="text-2xl">1.2 {t("days")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  0.3 {t("days faster than last month")}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-chess-beige-100 rounded-md p-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input 
                  placeholder={t("Search orders...")} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("All statuses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("All statuses")}</SelectItem>
                    <SelectItem value="pending">{t("Pending")}</SelectItem>
                    <SelectItem value="processing">{t("Processing")}</SelectItem>
                    <SelectItem value="shipped">{t("Shipped")}</SelectItem>
                    <SelectItem value="completed">{t("Completed")}</SelectItem>
                    <SelectItem value="cancelled">{t("Cancelled")}</SelectItem>
                    <SelectItem value="refunded">{t("Refunded")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableCaption>{t("A list of all orders")}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Order ID")}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t("Customer")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("Date")}</TableHead>
                    <TableHead>{t("Total")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{t("Payment")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                    <TableHead className="text-right">{t("Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex justify-center">
                          <div className="w-6 h-6 border-2 border-t-chess-accent rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{t("Loading orders...")}</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <p className="text-gray-500">{t("No orders found")}</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell className="hidden sm:table-cell">{order.customerName}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatDate(order.date)}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant={
                            order.paymentStatus === 'paid' ? 'default' : 
                            order.paymentStatus === 'awaiting' ? 'secondary' : 
                            'destructive'
                          }>
                            {t(order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1))}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === 'completed' ? 'default' : 
                            order.status === 'processing' ? 'secondary' :
                            order.status === 'shipped' ? 'outline' :
                            order.status === 'pending' ? 'secondary' :
                            'destructive'
                          }>
                            {t(order.status.charAt(0).toUpperCase() + order.status.slice(1))}
                          </Badge>
                        </TableCell>
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
                              <DropdownMenuItem onClick={() => handleViewOrderDetails(order)}>
                                <FileText className="h-4 w-4 mr-2" /> {t("View Details")}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              
                              {order.status === 'pending' && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                                >
                                  <Package className="h-4 w-4 mr-2" /> {t("Mark as Processing")}
                                </DropdownMenuItem>
                              )}
                              
                              {order.status === 'processing' && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateOrderStatus(order.id, "shipped")}
                                >
                                  <Truck className="h-4 w-4 mr-2" /> {t("Mark as Shipped")}
                                </DropdownMenuItem>
                              )}
                              
                              {order.status === 'shipped' && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" /> {t("Mark as Completed")}
                                </DropdownMenuItem>
                              )}
                              
                              {(order.status === 'pending' || order.status === 'processing') && (
                                <DropdownMenuItem 
                                  onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                                >
                                  <Ban className="h-4 w-4 mr-2" /> {t("Cancel Order")}
                                </DropdownMenuItem>
                              )}
                              
                              {order.paymentStatus === 'paid' && order.status !== 'refunded' && (
                                <DropdownMenuItem 
                                  onClick={() => handleProcessRefund(order.id)}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" /> {t("Process Refund")}
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" /> {t("Download Invoice")}
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
          </div>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Total Revenue")}</CardDescription>
                <CardTitle className="text-2xl">${totalRevenue.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  +12.3% {t("from last month")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Transactions")}</CardDescription>
                <CardTitle className="text-2xl">{orders.filter(o => o.paymentStatus === 'paid').length}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  {orders.filter(o => o.paymentStatus === 'awaiting').length} {t("pending")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Most Used Method")}</CardDescription>
                <CardTitle className="text-lg">{t("Credit Card")}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  {orders.filter(o => o.paymentMethod === 'credit-card').length} {t("transactions")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Refunds")}</CardDescription>
                <CardTitle className="text-2xl">
                  {orders.filter(o => o.paymentStatus === 'refunded').length}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  ${orders.filter(o => o.paymentStatus === 'refunded').reduce((sum, order) => sum + order.total, 0).toFixed(2)} {t("total")}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-chess-beige-100 rounded-md p-4">
            <h3 className="font-medium mb-4">{t("Recent Transactions")}</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Transaction ID")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("Date")}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t("Customer")}</TableHead>
                    <TableHead>{t("Method")}</TableHead>
                    <TableHead>{t("Amount")}</TableHead>
                    <TableHead>{t("Status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.filter(order => order.paymentStatus !== 'awaiting').slice(0, 5).map((order) => (
                    <TableRow key={`tx-${order.id}`}>
                      <TableCell className="font-medium">TX-{order.id.split('-')[1]}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(order.date)}</TableCell>
                      <TableCell className="hidden sm:table-cell">{order.customerName}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {order.paymentMethod === 'credit-card' ? (
                            <CreditCard className="h-4 w-4 mr-2" />
                          ) : (
                            <FileText className="h-4 w-4 mr-2" />
                          )}
                          {order.paymentMethod === 'credit-card' ? t('Credit Card') : 
                           order.paymentMethod === 'paypal' ? 'PayPal' : 
                           t('Bank Transfer')}
                        </div>
                      </TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={
                          order.paymentStatus === 'paid' ? 'default' : 
                          'destructive'
                        }>
                          {t(order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1))}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="bg-chess-beige-100 rounded-md p-4">
            <h3 className="font-medium mb-4">{t("Payment Methods")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t("Credit Card")}</CardTitle>
                    <CreditCard className="h-5 w-5 text-chess-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter(o => o.paymentMethod === 'credit-card').length} 
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      {t("orders")}
                    </span>
                  </div>
                  <div className="text-lg font-medium mt-1">
                    ${orders.filter(o => o.paymentMethod === 'credit-card').reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">PayPal</CardTitle>
                    <FileText className="h-5 w-5 text-chess-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter(o => o.paymentMethod === 'paypal').length}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      {t("orders")}
                    </span>
                  </div>
                  <div className="text-lg font-medium mt-1">
                    ${orders.filter(o => o.paymentMethod === 'paypal').reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t("Bank Transfer")}</CardTitle>
                    <FileText className="h-5 w-5 text-chess-accent" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter(o => o.paymentMethod === 'bank-transfer').length}
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      {t("orders")}
                    </span>
                  </div>
                  <div className="text-lg font-medium mt-1">
                    ${orders.filter(o => o.paymentMethod === 'bank-transfer').reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Sales Growth")}</CardDescription>
                <CardTitle className="text-2xl">+12.5%</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  {t("Compared to last month")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Conversion Rate")}</CardDescription>
                <CardTitle className="text-2xl">3.2%</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  +0.5% {t("from last month")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Average Order Value")}</CardDescription>
                <CardTitle className="text-2xl">$186.25</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  +$12.40 {t("from last month")}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t("Customer Retention")}</CardDescription>
                <CardTitle className="text-2xl">68%</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  +5% {t("from last quarter")}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("Revenue by Day")}</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart4 className="h-20 w-20 text-gray-300" />
                  <div className="absolute">
                    <p className="text-sm text-center text-gray-500">
                      {t("Revenue chart would render here")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t("Top Products")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Smart Chess Board</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-chess-accent h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$599.97</p>
                      <p className="text-xs text-gray-500">3 units</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Annual Subscription</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-chess-accent h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$227.94</p>
                      <p className="text-xs text-gray-500">3 units</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Advanced Course Bundle</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-chess-accent h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$149.99</p>
                      <p className="text-xs text-gray-500">1 unit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Premium Pieces Set</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-chess-accent h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$50.00</p>
                      <p className="text-xs text-gray-500">1 unit</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Chess Clock</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-chess-accent h-2 rounded-full" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$25.02</p>
                      <p className="text-xs text-gray-500">1 unit</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("Report Generation")}</CardTitle>
              <CardDescription>
                {t("Download various reports for further analysis")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" /> {t("Sales Report")}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" /> {t("Product Performance")}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" /> {t("Customer Analysis")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("Order Details")}</DialogTitle>
            <DialogDescription>
              {selectedOrder && `${t("Order")} #${selectedOrder.id} - ${formatDate(selectedOrder.date)}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">{t("Customer Information")}</h4>
                  <div className="rounded-md border p-3">
                    <p className="font-medium">{selectedOrder.customerName}</p>
                    <p className="text-gray-500 text-sm">ID: {selectedOrder.customerId}</p>
                    {/* Placeholder for additional customer info */}
                    <p className="text-gray-500 text-sm">email@example.com</p>
                    <p className="text-gray-500 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">{t("Order Status")}</h4>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t("Order Status")}</span>
                      <Badge variant={
                        selectedOrder.status === 'completed' ? 'default' : 
                        selectedOrder.status === 'processing' ? 'secondary' :
                        selectedOrder.status === 'shipped' ? 'outline' :
                        selectedOrder.status === 'pending' ? 'secondary' :
                        'destructive'
                      }>
                        {t(selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1))}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("Payment Status")}</span>
                      <Badge variant={
                        selectedOrder.paymentStatus === 'paid' ? 'default' : 
                        selectedOrder.paymentStatus === 'awaiting' ? 'secondary' : 
                        'destructive'
                      }>
                        {t(selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1))}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">{t("Order Items")}</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Product")}</TableHead>
                        <TableHead className="text-right">{t("Quantity")}</TableHead>
                        <TableHead className="text-right">{t("Price")}</TableHead>
                        <TableHead className="text-right">{t("Total")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">{t("Payment Information")}</h4>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t("Payment Method")}</span>
                      <span>
                        {selectedOrder.paymentMethod === 'credit-card' ? t('Credit Card') : 
                        selectedOrder.paymentMethod === 'paypal' ? 'PayPal' : 
                        t('Bank Transfer')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("Transaction ID")}</span>
                      <span>TX-{selectedOrder.id.split('-')[1]}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">{t("Order Summary")}</h4>
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t("Subtotal")}</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{t("Shipping")}</span>
                      <span>{t("Free")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("Total")}</span>
                      <span className="font-bold">${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  onClick={() => setIsOrderDetailsOpen(false)}
                >
                  {t("Close")}
                </Button>
                
                <Button 
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" /> {t("Download Invoice")}
                </Button>
                
                {selectedOrder.status === 'pending' && (
                  <Button 
                    className="bg-chess-accent hover:bg-chess-accent/90"
                    onClick={() => {
                      handleUpdateOrderStatus(selectedOrder.id, "processing");
                      setIsOrderDetailsOpen(false);
                    }}
                  >
                    <Package className="h-4 w-4 mr-2" /> {t("Mark as Processing")}
                  </Button>
                )}
                
                {selectedOrder.status === 'processing' && (
                  <Button 
                    className="bg-chess-accent hover:bg-chess-accent/90"
                    onClick={() => {
                      handleUpdateOrderStatus(selectedOrder.id, "shipped");
                      setIsOrderDetailsOpen(false);
                    }}
                  >
                    <Truck className="h-4 w-4 mr-2" /> {t("Mark as Shipped")}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPayments;
