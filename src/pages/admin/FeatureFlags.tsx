
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Flag, Search, Filter, Plus, Settings, AlertCircle, Trash2, Tag, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { adminApi } from "@/services/api/endpoints/adminApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock Feature Flags Data
const mockFeatureFlags = [
  {
    id: "ff-001",
    name: "new_chessboard_ui",
    displayName: "New Chessboard UI",
    description: "New redesigned chessboard interface with improved animations",
    enabled: true,
    environment: "production",
    category: "ui",
    lastUpdated: "2025-05-01T10:45:22Z",
    updatedBy: "admin@smartchess.com"
  },
  {
    id: "ff-002",
    name: "social_sharing",
    displayName: "Social Sharing",
    description: "Allow users to share games on social media platforms",
    enabled: false,
    environment: "beta",
    category: "social",
    lastUpdated: "2025-04-28T14:22:11Z",
    updatedBy: "admin@smartchess.com"
  },
  {
    id: "ff-003",
    name: "voice_commands",
    displayName: "Voice Commands",
    description: "Enable voice commands for moving pieces on the board",
    enabled: false,
    environment: "alpha",
    category: "accessibility",
    lastUpdated: "2025-04-12T09:17:32Z",
    updatedBy: "dev@smartchess.com"
  },
  {
    id: "ff-004",
    name: "ai_game_analysis",
    displayName: "AI Game Analysis",
    description: "AI-powered game analysis and move suggestions",
    enabled: true,
    environment: "production",
    category: "ai",
    lastUpdated: "2025-04-30T16:33:45Z",
    updatedBy: "admin@smartchess.com"
  },
  {
    id: "ff-005",
    name: "tournament_brackets",
    displayName: "Tournament Brackets",
    description: "Visual tournament brackets and elimination trees",
    enabled: true,
    environment: "production",
    category: "tournaments",
    lastUpdated: "2025-04-20T11:28:17Z",
    updatedBy: "admin@smartchess.com"
  },
  {
    id: "ff-006",
    name: "chess960_variant",
    displayName: "Chess960 Variant",
    description: "Support for Chess960 (Fischer Random Chess) variant",
    enabled: false,
    environment: "beta",
    category: "gameplay",
    lastUpdated: "2025-04-15T10:12:33Z",
    updatedBy: "dev@smartchess.com"
  },
  {
    id: "ff-007",
    name: "game_chat_emoji",
    displayName: "Game Chat Emoji",
    description: "Emoji support in game chat",
    enabled: true,
    environment: "production",
    category: "chat",
    lastUpdated: "2025-04-25T09:03:22Z",
    updatedBy: "admin@smartchess.com"
  }
];

const FeatureFlags = () => {
  const { t } = useLanguageContext();
  const queryClient = useQueryClient();
  
  // State for filtering and new feature flag
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEnvironment, setSelectedEnvironment] = useState("all");
  const [newFeatureFlagDialog, setNewFeatureFlagDialog] = useState(false);
  
  // New feature flag form state
  const [newFeatureFlag, setNewFeatureFlag] = useState({
    name: "",
    displayName: "",
    description: "",
    category: "ui",
    environment: "production",
    enabled: false
  });
  
  // Query to fetch feature flags
  const { data: featureFlags, isLoading } = useQuery({
    queryKey: ['featureFlags'],
    queryFn: () => {
      // TODO: Replace with actual API call
      // return adminApi.getFeatureFlags();
      return new Promise(resolve => {
        setTimeout(() => resolve(mockFeatureFlags), 1000);
      });
    }
  });
  
  // Mutation to update feature flag
  const updateFeatureFlagMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string, enabled: boolean }) => {
      // TODO: Replace with actual API call
      // return adminApi.updateFeatureFlag(id, enabled);
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
    }
  });
  
  // Mutation to create new feature flag
  const createFeatureFlagMutation = useMutation({
    mutationFn: async (flagData: typeof newFeatureFlag) => {
      // TODO: Replace with actual API call
      // return adminApi.createFeatureFlag(flagData);
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featureFlags'] });
      setNewFeatureFlagDialog(false);
      resetNewFeatureFlagForm();
      toast.success(t("Feature flag created successfully"));
    },
    onError: () => {
      toast.error(t("Failed to create feature flag"));
    }
  });
  
  const handleToggleFeatureFlag = async (id: string, currentState: boolean) => {
    try {
      await updateFeatureFlagMutation.mutateAsync({ id, enabled: !currentState });
      toast.success(t("Feature flag updated"));
    } catch (error) {
      toast.error(t("Failed to update feature flag"));
      console.error("Error updating feature flag:", error);
    }
  };
  
  const handleCreateFeatureFlag = () => {
    // Validation
    if (!newFeatureFlag.name || !newFeatureFlag.displayName) {
      toast.error(t("Name and display name are required"));
      return;
    }
    
    // Replace spaces with underscores and convert to lowercase for the name
    const formattedName = newFeatureFlag.name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    
    createFeatureFlagMutation.mutate({
      ...newFeatureFlag,
      name: formattedName
    });
  };
  
  const resetNewFeatureFlagForm = () => {
    setNewFeatureFlag({
      name: "",
      displayName: "",
      description: "",
      category: "ui",
      environment: "production",
      enabled: false
    });
  };
  
  // Filter feature flags based on search and filters
  const filteredFeatureFlags = featureFlags?.filter(flag => {
    const matchesSearch = searchQuery === "" || 
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      flag.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || flag.category === selectedCategory;
    const matchesEnvironment = selectedEnvironment === "all" || flag.environment === selectedEnvironment;
    
    return matchesSearch && matchesCategory && matchesEnvironment;
  }) || [];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Get unique categories and environments for filters
  const categories = featureFlags ? [...new Set(featureFlags.map(flag => flag.category))] : [];
  const environments = featureFlags ? [...new Set(featureFlags.map(flag => flag.environment))] : [];
  
  // Count enabled and total features
  const enabledCount = featureFlags?.filter(flag => flag.enabled).length || 0;
  const totalCount = featureFlags?.length || 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("Feature Flags")}</h2>
          <p className="text-muted-foreground">
            {t("Toggle features on and off across the platform")}
          </p>
        </div>
        <Button className="flex gap-2" onClick={() => setNewFeatureFlagDialog(true)}>
          <Plus className="h-4 w-4" />
          {t("New Feature Flag")}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{t("Active Features")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{enabledCount}</p>
                <p className="text-xs text-muted-foreground">
                  {t("out of")} {totalCount} {t("total features")}
                </p>
              </div>
              <Flag className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{t("Environment Status")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge className="mr-2">PROD</Badge>
                  <span className="text-sm">{t("Production")}</span>
                </div>
                <span className="text-sm font-medium">
                  {featureFlags?.filter(f => f.environment === "production" && f.enabled).length || 0}/{featureFlags?.filter(f => f.environment === "production").length || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">BETA</Badge>
                  <span className="text-sm">{t("Beta Testing")}</span>
                </div>
                <span className="text-sm font-medium">
                  {featureFlags?.filter(f => f.environment === "beta" && f.enabled).length || 0}/{featureFlags?.filter(f => f.environment === "beta").length || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-2">ALPHA</Badge>
                  <span className="text-sm">{t("Alpha Testing")}</span>
                </div>
                <span className="text-sm font-medium">
                  {featureFlags?.filter(f => f.environment === "alpha" && f.enabled).length || 0}/{featureFlags?.filter(f => f.environment === "alpha").length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{t("Categories")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(selectedCategory === category ? "all" : category)}
                >
                  {category}
                </Badge>
              ))}
              {categories.length > 0 && (
                <Badge 
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory("all")}
                >
                  {t("all")}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("Search feature flags...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        
        <Select
          value={selectedEnvironment}
          onValueChange={setSelectedEnvironment}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder={t("Environment")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Environments")}</SelectItem>
            {environments.map(env => (
              <SelectItem key={env} value={env}>
                {env.charAt(0).toUpperCase() + env.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">{t("Feature")}</TableHead>
                <TableHead>{t("Description")}</TableHead>
                <TableHead className="w-[100px]">{t("Status")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("Environment")}</TableHead>
                <TableHead className="hidden md:table-cell">{t("Last Updated")}</TableHead>
                <TableHead className="w-[100px] text-right">{t("Toggle")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell colSpan={6}>
                      <div className="h-12 w-full animate-pulse bg-muted rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredFeatureFlags.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Flag className="h-12 w-12 mb-2" />
                      <p className="text-lg font-medium">{t("No Feature Flags Found")}</p>
                      <p className="text-sm">{t("Try a different search term or create a new feature flag")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeatureFlags.map(flag => (
                  <TableRow key={flag.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{flag.displayName}</div>
                        <div className="text-sm text-muted-foreground font-mono">{flag.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {flag.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={flag.enabled ? "default" : "outline"}>
                        {flag.enabled ? t("Enabled") : t("Disabled")}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge 
                        variant={
                          flag.environment === "production" ? "default" :
                          flag.environment === "beta" ? "outline" : "secondary"
                        }
                      >
                        {flag.environment.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm">
                        {formatDate(flag.lastUpdated)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {flag.updatedBy}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={flag.enabled}
                        onCheckedChange={() => handleToggleFeatureFlag(flag.id, flag.enabled)}
                        disabled={updateFeatureFlagMutation.isPending}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* New Feature Flag Dialog */}
      <Dialog open={newFeatureFlagDialog} onOpenChange={setNewFeatureFlagDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("Create New Feature Flag")}</DialogTitle>
            <DialogDescription>
              {t("Add a new feature flag to control functionality across the platform")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                {t("Display Name")}
              </Label>
              <Input 
                id="displayName" 
                value={newFeatureFlag.displayName}
                onChange={(e) => setNewFeatureFlag({...newFeatureFlag, displayName: e.target.value})}
                className="col-span-3" 
                placeholder="New Feature"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                {t("Key")}
              </Label>
              <Input 
                id="name" 
                value={newFeatureFlag.name}
                onChange={(e) => setNewFeatureFlag({...newFeatureFlag, name: e.target.value})}
                className="col-span-3 font-mono" 
                placeholder="new_feature"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                {t("Description")}
              </Label>
              <Input 
                id="description" 
                value={newFeatureFlag.description}
                onChange={(e) => setNewFeatureFlag({...newFeatureFlag, description: e.target.value})}
                className="col-span-3" 
                placeholder="Describe this feature flag"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                {t("Category")}
              </Label>
              <Select 
                value={newFeatureFlag.category}
                onValueChange={(value) => setNewFeatureFlag({...newFeatureFlag, category: value})}
              >
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder={t("Select category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ui">{t("UI")}</SelectItem>
                  <SelectItem value="functionality">{t("Functionality")}</SelectItem>
                  <SelectItem value="accessibility">{t("Accessibility")}</SelectItem>
                  <SelectItem value="performance">{t("Performance")}</SelectItem>
                  <SelectItem value="social">{t("Social")}</SelectItem>
                  <SelectItem value="gameplay">{t("Gameplay")}</SelectItem>
                  <SelectItem value="ai">{t("AI")}</SelectItem>
                  <SelectItem value="tournaments">{t("Tournaments")}</SelectItem>
                  <SelectItem value="chat">{t("Chat")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="environment" className="text-right">
                {t("Environment")}
              </Label>
              <Select 
                value={newFeatureFlag.environment}
                onValueChange={(value) => setNewFeatureFlag({...newFeatureFlag, environment: value})}
              >
                <SelectTrigger id="environment" className="col-span-3">
                  <SelectValue placeholder={t("Select environment")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">{t("Production")}</SelectItem>
                  <SelectItem value="beta">{t("Beta")}</SelectItem>
                  <SelectItem value="alpha">{t("Alpha")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="enabled" className="text-right">
                {t("Initial State")}
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch 
                  id="enabled" 
                  checked={newFeatureFlag.enabled}
                  onCheckedChange={(checked) => setNewFeatureFlag({...newFeatureFlag, enabled: checked})}
                />
                <Label htmlFor="enabled" className="cursor-pointer">
                  {newFeatureFlag.enabled ? t("Enabled") : t("Disabled")}
                </Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                resetNewFeatureFlagForm();
                setNewFeatureFlagDialog(false);
              }}
              disabled={createFeatureFlagMutation.isPending}
            >
              {t("Cancel")}
            </Button>
            <Button 
              onClick={handleCreateFeatureFlag}
              disabled={createFeatureFlagMutation.isPending || !newFeatureFlag.displayName || !newFeatureFlag.name}
            >
              {createFeatureFlagMutation.isPending ? t("Creating...") : t("Create Flag")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FeatureFlags;
