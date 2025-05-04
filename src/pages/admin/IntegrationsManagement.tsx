
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { integrationsApi } from "@/services/api/apiEndpoints";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useLanguageContext } from "@/contexts/LanguageContext";
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
  RefreshCw,
  Plus,
  Settings,
  Link,
  Unlink,
  Trash,
  Check,
  Edit,
  Copy,
  X,
} from "lucide-react";

// Define integration types
type IntegrationType = 'payment' | 'analytics' | 'communication' | 'authentication' | 'storage' | 'ai' | 'other';

interface Integration {
  id: string;
  name: string;
  provider: string;
  type: IntegrationType;
  status: 'active' | 'inactive' | 'error' | 'pending';
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastSync?: string;
  description?: string;
  settings: Record<string, any>;
}

const IntegrationsManagement = () => {
  const { t } = useLanguageContext();
  const [activeTab, setActiveTab] = useState<string>("installed");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    provider: "",
    type: "other" as IntegrationType,
    apiKey: "",
    apiSecret: "",
    webhookUrl: "",
    description: "",
    settings: {}
  });

  // Fetch installed integrations
  const { 
    data: integrations = [], 
    isLoading: isLoadingIntegrations, 
    refetch: refetchIntegrations 
  } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      try {
        const response = await integrationsApi.getAllIntegrations();
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch integrations:", error);
        toast({
          title: "Error",
          description: "Failed to fetch integrations. Please try again later.",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  // Fetch available integrations
  const { 
    data: availableIntegrations = [], 
    isLoading: isLoadingAvailable 
  } = useQuery({
    queryKey: ['available-integrations'],
    queryFn: async () => {
      try {
        const response = await integrationsApi.getAvailableIntegrations();
        return response.data || [];
      } catch (error) {
        console.error("Failed to fetch available integrations:", error);
        return [];
      }
    }
  });

  // Filter integrations based on search term
  const filteredIntegrations = integrations.filter((integration: Integration) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      integration.name.toLowerCase().includes(searchLower) ||
      integration.provider.toLowerCase().includes(searchLower) ||
      integration.type.toLowerCase().includes(searchLower)
    );
  });

  // Handle adding a new integration
  const handleAddIntegration = async () => {
    try {
      if (!newIntegration.name || !newIntegration.provider) {
        toast({
          title: "Validation Error",
          description: "Integration name and provider are required.",
          variant: "destructive"
        });
        return;
      }
      
      await integrationsApi.createIntegration(newIntegration);
      toast({
        title: "Success",
        description: `Added new integration: ${newIntegration.name}`,
      });
      
      setNewIntegration({
        name: "",
        provider: "",
        type: "other" as IntegrationType,
        apiKey: "",
        apiSecret: "",
        webhookUrl: "",
        description: "",
        settings: {}
      });
      setIsAddDialogOpen(false);
      refetchIntegrations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add integration. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle updating an integration
  const handleUpdateIntegration = async () => {
    if (!selectedIntegration) return;
    
    try {
      await integrationsApi.updateIntegration(selectedIntegration.id, selectedIntegration);
      toast({
        title: "Success",
        description: "Integration updated successfully.",
      });
      setIsEditDialogOpen(false);
      refetchIntegrations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integration. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle deleting an integration
  const handleDeleteIntegration = async () => {
    if (!selectedIntegration) return;
    
    try {
      await integrationsApi.deleteIntegration(selectedIntegration.id);
      toast({
        title: "Success",
        description: "Integration deleted successfully.",
      });
      setIsDeleteDialogOpen(false);
      refetchIntegrations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete integration. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle testing an integration
  const handleTestIntegration = async (integrationId: string) => {
    try {
      await integrationsApi.testIntegration(integrationId);
      toast({
        title: "Test Complete",
        description: "Integration test completed successfully.",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Integration test failed. Please check your configuration.",
        variant: "destructive"
      });
    }
  };

  // Handle toggling integration status
  const handleToggleIntegrationStatus = async (integration: Integration) => {
    try {
      if (integration.status === 'active') {
        await integrationsApi.disableIntegration(integration.id);
        toast({
          title: "Success",
          description: "Integration disabled successfully.",
        });
      } else {
        await integrationsApi.enableIntegration(integration.id);
        toast({
          title: "Success",
          description: "Integration enabled successfully.",
        });
      }
      refetchIntegrations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integration status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Helper function to copy API key/secret to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${type} copied to clipboard.`,
    });
  };

  // Render status badge for integration
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-chess-text-light">{t("Integrations Management")}</h1>
          <p className="text-chess-text-light/70">
            Connect and manage third-party services and integrations for your application.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => refetchIntegrations()}
            className="gap-2"
          >
            <RefreshCw size={16} />
            {t("Refresh")}
          </Button>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="gap-2"
          >
            <Plus size={16} />
            {t("Add Integration")}
          </Button>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="available">Available Integrations</TabsTrigger>
          <TabsTrigger value="settings">Global Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="installed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Installed Integrations</CardTitle>
              <CardDescription>Manage your connected third-party services.</CardDescription>
              <div className="mt-2">
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingIntegrations ? (
                <div className="flex flex-col space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse h-16 bg-gray-700/30 rounded w-full"></div>
                  ))}
                </div>
              ) : filteredIntegrations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Integration</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIntegrations.map((integration: Integration) => (
                      <TableRow key={integration.id}>
                        <TableCell>
                          <div className="font-medium">{integration.name}</div>
                          <div className="text-sm text-muted-foreground">{integration.provider}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {integration.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{renderStatusBadge(integration.status)}</TableCell>
                        <TableCell>
                          {new Date(integration.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleIntegrationStatus(integration)}
                              title={integration.status === 'active' ? 'Disable' : 'Enable'}
                            >
                              {integration.status === 'active' ? <Unlink size={16} /> : <Link size={16} />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedIntegration(integration);
                                setIsEditDialogOpen(true);
                              }}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleTestIntegration(integration.id)}
                              title="Test Connection"
                            >
                              <Check size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => {
                                setSelectedIntegration(integration);
                                setIsDeleteDialogOpen(true);
                              }}
                              title="Delete"
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-chess-text-light/60">
                  {searchTerm ? (
                    <div>
                      <p className="mb-2">No integrations matching your search criteria.</p>
                      <Button
                        variant="outline"
                        onClick={() => setSearchTerm("")}
                        className="mt-2"
                      >
                        Clear Search
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">No integrations have been added yet.</p>
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="mt-2"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Your First Integration
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
              <CardDescription>Discover integrations that you can add to your application.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingAvailable ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse h-40 bg-gray-700/30 rounded w-full"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Sample integration cards - in a real app, you would map over availableIntegrations */}
                  <Card className="border border-gray-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Stripe Payments</CardTitle>
                      <CardDescription>Payment processing</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-chess-text-light/70">
                        Accept payments, manage subscriptions, and fight fraud with Stripe's unified platform.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setNewIntegration({
                            ...newIntegration,
                            name: "Stripe Payments",
                            provider: "Stripe",
                            type: "payment"
                          });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Integration
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-gray-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Google Analytics</CardTitle>
                      <CardDescription>Analytics service</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-chess-text-light/70">
                        Track and report website traffic, user behavior, and conversion metrics.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setNewIntegration({
                            ...newIntegration,
                            name: "Google Analytics",
                            provider: "Google",
                            type: "analytics"
                          });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Integration
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-gray-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Mailchimp</CardTitle>
                      <CardDescription>Email marketing</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-chess-text-light/70">
                        Marketing automation platform and email marketing service.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setNewIntegration({
                            ...newIntegration,
                            name: "Mailchimp",
                            provider: "Mailchimp",
                            type: "communication"
                          });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Integration
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-gray-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Discord</CardTitle>
                      <CardDescription>Community platform</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-chess-text-light/70">
                        Connect your application with Discord servers for notifications and community features.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setNewIntegration({
                            ...newIntegration,
                            name: "Discord",
                            provider: "Discord",
                            type: "communication"
                          });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Integration
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-gray-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">OpenAI</CardTitle>
                      <CardDescription>AI capabilities</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-chess-text-light/70">
                        Add AI functionality like game analysis, move suggestions, and learning content generation.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setNewIntegration({
                            ...newIntegration,
                            name: "OpenAI",
                            provider: "OpenAI",
                            type: "ai"
                          });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Integration
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border border-gray-700/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">AWS S3</CardTitle>
                      <CardDescription>Cloud storage</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-chess-text-light/70">
                        Secure cloud storage for media, game records, and user-generated content.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setNewIntegration({
                            ...newIntegration,
                            name: "AWS S3",
                            provider: "Amazon",
                            type: "storage"
                          });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Plus size={16} className="mr-2" />
                        Add Integration
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Integration Settings</CardTitle>
              <CardDescription>Configure settings that apply to all integrations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Security Settings</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="encrypt-keys" />
                    <Label htmlFor="encrypt-keys">Encrypt API keys and secrets</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="auto-rotate" />
                    <Label htmlFor="auto-rotate">Enable automatic credential rotation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="audit-logs" />
                    <Label htmlFor="audit-logs">Enable detailed audit logs for integration activities</Label>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Rate Limiting</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-rate-limit">Default rate limit (requests per minute)</Label>
                      <Input 
                        id="default-rate-limit"
                        type="number"
                        placeholder="60"
                        min={1}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rate-limit-buffer">Rate limit buffer (%)</Label>
                      <Input 
                        id="rate-limit-buffer"
                        type="number"
                        placeholder="20"
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Proxy Settings</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="use-proxy" />
                    <Label htmlFor="use-proxy">Use proxy for external API calls</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="proxy-host">Proxy host</Label>
                      <Input 
                        id="proxy-host"
                        placeholder="proxy.example.com"
                        disabled={true}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="proxy-port">Proxy port</Label>
                      <Input 
                        id="proxy-port"
                        type="number"
                        placeholder="8080"
                        min={1}
                        max={65535}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Webhook Settings</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="retry-failed" defaultChecked />
                    <Label htmlFor="retry-failed">Retry failed webhook deliveries</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-retries">Maximum retry attempts</Label>
                      <Input 
                        id="max-retries"
                        type="number"
                        placeholder="5"
                        min={0}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="retry-delay">Retry delay (seconds)</Label>
                      <Input 
                        id="retry-delay"
                        type="number"
                        placeholder="60"
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Integration Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Integration</DialogTitle>
            <DialogDescription>
              Connect a new third-party service to your application.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="integration-name">Integration Name</Label>
                <Input 
                  id="integration-name"
                  placeholder="My Integration"
                  value={newIntegration.name}
                  onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="integration-provider">Provider</Label>
                <Input 
                  id="integration-provider"
                  placeholder="Provider Name"
                  value={newIntegration.provider}
                  onChange={(e) => setNewIntegration({...newIntegration, provider: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="integration-type">Integration Type</Label>
                <select 
                  id="integration-type"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={newIntegration.type}
                  onChange={(e) => setNewIntegration({...newIntegration, type: e.target.value as IntegrationType})}
                >
                  <option value="payment">Payment</option>
                  <option value="analytics">Analytics</option>
                  <option value="communication">Communication</option>
                  <option value="authentication">Authentication</option>
                  <option value="storage">Storage</option>
                  <option value="ai">AI/Machine Learning</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="integration-webhook">Webhook URL (Optional)</Label>
                <Input 
                  id="integration-webhook"
                  placeholder="https://example.com/webhook"
                  value={newIntegration.webhookUrl}
                  onChange={(e) => setNewIntegration({...newIntegration, webhookUrl: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="integration-description">Description</Label>
              <Input 
                id="integration-description"
                placeholder="Brief description of this integration"
                value={newIntegration.description}
                onChange={(e) => setNewIntegration({...newIntegration, description: e.target.value})}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="integration-api-key">API Key</Label>
              <Input 
                id="integration-api-key"
                type="password"
                placeholder="Your API Key"
                value={newIntegration.apiKey}
                onChange={(e) => setNewIntegration({...newIntegration, apiKey: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="integration-api-secret">API Secret</Label>
              <Input 
                id="integration-api-secret"
                type="password"
                placeholder="Your API Secret"
                value={newIntegration.apiSecret}
                onChange={(e) => setNewIntegration({...newIntegration, apiSecret: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddIntegration}>
              Add Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Integration Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Integration</DialogTitle>
            <DialogDescription>
              Update your integration settings.
            </DialogDescription>
          </DialogHeader>
          
          {selectedIntegration && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Integration Name</Label>
                  <Input 
                    id="edit-name"
                    value={selectedIntegration.name}
                    onChange={(e) => setSelectedIntegration({...selectedIntegration, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-provider">Provider</Label>
                  <Input 
                    id="edit-provider"
                    value={selectedIntegration.provider}
                    onChange={(e) => setSelectedIntegration({...selectedIntegration, provider: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Integration Type</Label>
                  <select 
                    id="edit-type"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={selectedIntegration.type}
                    onChange={(e) => setSelectedIntegration({...selectedIntegration, type: e.target.value as IntegrationType})}
                  >
                    <option value="payment">Payment</option>
                    <option value="analytics">Analytics</option>
                    <option value="communication">Communication</option>
                    <option value="authentication">Authentication</option>
                    <option value="storage">Storage</option>
                    <option value="ai">AI/Machine Learning</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select 
                    id="edit-status"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={selectedIntegration.status}
                    onChange={(e) => setSelectedIntegration({
                      ...selectedIntegration, 
                      status: e.target.value as 'active' | 'inactive' | 'error' | 'pending'
                    })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="error">Error</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-webhook">Webhook URL</Label>
                <Input 
                  id="edit-webhook"
                  placeholder="https://example.com/webhook"
                  value={selectedIntegration.webhookUrl || ''}
                  onChange={(e) => setSelectedIntegration({...selectedIntegration, webhookUrl: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input 
                  id="edit-description"
                  value={selectedIntegration.description || ''}
                  onChange={(e) => setSelectedIntegration({...selectedIntegration, description: e.target.value})}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-api-key">API Key</Label>
                  {selectedIntegration.apiKey && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(selectedIntegration.apiKey || '', 'API Key')}
                    >
                      <Copy size={14} className="mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
                <Input 
                  id="edit-api-key"
                  type="password"
                  value={selectedIntegration.apiKey || ''}
                  onChange={(e) => setSelectedIntegration({...selectedIntegration, apiKey: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-api-secret">API Secret</Label>
                  {selectedIntegration.apiSecret && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(selectedIntegration.apiSecret || '', 'API Secret')}
                    >
                      <Copy size={14} className="mr-1" />
                      Copy
                    </Button>
                  )}
                </div>
                <Input 
                  id="edit-api-secret"
                  type="password"
                  value={selectedIntegration.apiSecret || ''}
                  onChange={(e) => setSelectedIntegration({...selectedIntegration, apiSecret: e.target.value})}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateIntegration}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Integration Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Integration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this integration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedIntegration && (
            <div className="py-4">
              <div className="bg-background/50 border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedIntegration.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedIntegration.provider}</p>
                  </div>
                  {renderStatusBadge(selectedIntegration.status)}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteIntegration}>
              Delete Integration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationsManagement;
