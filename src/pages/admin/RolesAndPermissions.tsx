
import React, { useState } from "react";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  ShieldCheck,
  Users,
  RefreshCw,
  Search,
  Plus,
  Edit,
  Trash2,
  Settings,
  FileText,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types for roles and permissions
interface Permission {
  id: string;
  name: string;
  description: string;
  category: "users" | "content" | "games" | "admin" | "system";
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
  userCount: number;
  isSystem: boolean; // System roles cannot be modified or deleted
}

interface RoleFormData {
  id?: string;
  name: string;
  description: string;
  permissions: string[];
}

const RolesAndPermissions: React.FC = () => {
  const { t } = useLanguageContext();
  const queryClient = useQueryClient();
  
  // State for roles and permissions
  const [activeTab, setActiveTab] = useState<"roles" | "permissions">("roles");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [roleFormData, setRoleFormData] = useState<RoleFormData>({
    name: "",
    description: "",
    permissions: []
  });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Query for fetching roles
  const { 
    data: roles = [], 
    isLoading: isLoadingRoles,
    refetch: refetchRoles 
  } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      // TODO: Replace with actual API call to fetch roles
      console.log("Fetching roles");
      
      // Mock data for demonstration
      return [
        {
          id: "1",
          name: "Administrator",
          description: "Full system access and control",
          permissions: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          userCount: 3,
          isSystem: true
        },
        {
          id: "2",
          name: "Moderator",
          description: "Can moderate users and content",
          permissions: ["2", "3", "5", "6"],
          userCount: 8,
          isSystem: true
        },
        {
          id: "3",
          name: "Content Manager",
          description: "Can create and edit content",
          permissions: ["3", "5"],
          userCount: 12,
          isSystem: false
        },
        {
          id: "4",
          name: "Tournament Manager",
          description: "Can create and manage tournaments",
          permissions: ["4", "6"],
          userCount: 5,
          isSystem: false
        }
      ] as Role[];
    }
  });
  
  // Query for fetching permissions
  const { 
    data: permissions = [], 
    isLoading: isLoadingPermissions 
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      // TODO: Replace with actual API call to fetch permissions
      console.log("Fetching permissions");
      
      // Mock data for demonstration
      return [
        {
          id: "1",
          name: "manage_users",
          description: "Create, update, and delete users",
          category: "users"
        },
        {
          id: "2",
          name: "view_users",
          description: "View user data and profiles",
          category: "users"
        },
        {
          id: "3",
          name: "manage_content",
          description: "Create, update, and delete content pages",
          category: "content"
        },
        {
          id: "4",
          name: "manage_tournaments",
          description: "Create and manage tournaments",
          category: "games"
        },
        {
          id: "5",
          name: "publish_content",
          description: "Publish content to production",
          category: "content"
        },
        {
          id: "6",
          name: "moderate_comments",
          description: "Moderate user comments and discussions",
          category: "content"
        },
        {
          id: "7",
          name: "view_analytics",
          description: "View system analytics and reports",
          category: "admin"
        },
        {
          id: "8",
          name: "manage_settings",
          description: "Modify system settings",
          category: "admin"
        },
        {
          id: "9",
          name: "manage_roles",
          description: "Create, modify, and delete roles",
          category: "system"
        },
        {
          id: "10",
          name: "view_logs",
          description: "View system logs and audit trails",
          category: "system"
        }
      ] as Permission[];
    }
  });
  
  // Mutation for creating/updating a role
  const rolesMutation = useMutation({
    mutationFn: async (role: RoleFormData) => {
      // TODO: Replace with actual API call to create/update role
      console.log("Saving role:", role);
      
      // Mock API response
      return { success: true, id: role.id || Math.random().toString(36).substring(7) };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(roleFormData.id ? t("Role updated successfully") : t("Role created successfully"));
      setShowRoleDialog(false);
      resetRoleForm();
    },
    onError: () => {
      toast.error(roleFormData.id ? t("Failed to update role") : t("Failed to create role"));
    }
  });
  
  // Mutation for deleting a role
  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      // TODO: Replace with actual API call to delete role
      console.log("Deleting role with ID:", roleId);
      
      // Mock API response
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success(t("Role deleted successfully"));
      setConfirmDelete(null);
    },
    onError: () => {
      toast.error(t("Failed to delete role"));
    }
  });

  // Handle form submission for creating/updating a role
  const handleRoleSubmit = () => {
    if (!roleFormData.name) {
      toast.error(t("Role name is required"));
      return;
    }
    
    rolesMutation.mutate(roleFormData);
  };
  
  // Reset role form to default values
  const resetRoleForm = () => {
    setRoleFormData({
      name: "",
      description: "",
      permissions: []
    });
  };
  
  // Filter roles based on search term
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter permissions based on search term
  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group permissions by category
  const permissionsByCategory = filteredPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);
  
  // Function to open role editor with specific role data
  const editRole = (role: Role) => {
    setRoleFormData({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    });
    setShowRoleDialog(true);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-chess-text-light">{t("Roles & Permissions")}</h1>
          <p className="text-sm text-chess-text-light/70 mt-1">
            {t("Manage user roles and access permissions across the platform")}
          </p>
        </div>

        <Button 
          className="bg-chess-accent hover:bg-chess-accent/80"
          onClick={() => {
            resetRoleForm();
            setShowRoleDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("Create Role")}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="mb-2 sm:mb-0">
            <TabsTrigger value="roles">
              <Users className="h-4 w-4 mr-2" />
              {t("Roles")}
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <ShieldCheck className="h-4 w-4 mr-2" />
              {t("Permissions")}
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder={activeTab === "roles" ? t("Search roles...") : t("Search permissions...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full"
            />
            {searchTerm && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchTerm("")}
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t("User Roles")}</CardTitle>
              <CardDescription>
                {t("Define roles that determine what users can access and do")}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoadingRoles ? (
                <div className="flex justify-center items-center h-40">
                  <RefreshCw className="h-8 w-8 animate-spin text-chess-accent" />
                </div>
              ) : filteredRoles.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center py-16 text-chess-text-light/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Users className="h-16 w-16 mb-4 opacity-20" />
                  <h3 className="text-xl font-medium">{t("No roles found")}</h3>
                  <p className="text-sm mt-1">{t("Try different search terms or create a new role")}</p>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredRoles.map((role) => (
                    <motion.div
                      key={role.id}
                      variants={itemVariants}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-chess-text-light">{role.name}</h3>
                            {role.isSystem && (
                              <Badge variant="secondary" className="text-xs">
                                {t("System")}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-chess-text-light/70 mt-1">{role.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <Badge variant="outline">
                            {role.userCount} {role.userCount === 1 ? t("user") : t("users")}
                          </Badge>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRole(role)}
                          >
                            {t("View")}
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => editRole(role)}
                            disabled={role.isSystem}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600"
                            onClick={() => setConfirmDelete(role.id)}
                            disabled={role.isSystem}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Display permission count */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {role.permissions.length} {t("permissions")}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          {Object.keys(permissionsByCategory).length === 0 ? (
            isLoadingPermissions ? (
              <div className="flex justify-center items-center h-40">
                <RefreshCw className="h-8 w-8 animate-spin text-chess-accent" />
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <motion.div 
                    className="flex flex-col items-center justify-center py-16 text-chess-text-light/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ShieldCheck className="h-16 w-16 mb-4 opacity-20" />
                    <h3 className="text-xl font-medium">{t("No permissions found")}</h3>
                    <p className="text-sm mt-1">{t("Try clearing your search filter")}</p>
                  </motion.div>
                </CardContent>
              </Card>
            )
          ) : (
            Object.entries(permissionsByCategory).map(([category, perms]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="capitalize">{t(category)}</CardTitle>
                  <CardDescription>
                    {t("Permissions related to")} {t(category)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <motion.div
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {perms.map((permission) => (
                      <motion.div
                        key={permission.id}
                        variants={itemVariants}
                        className="flex items-start justify-between gap-4 border-b pb-3 last:border-b-0"
                      >
                        <div>
                          <div className="font-mono text-sm bg-chess-dark/20 px-2 py-1 rounded inline-block">
                            {permission.name}
                          </div>
                          <p className="text-sm mt-1">{permission.description}</p>
                        </div>
                        
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {roles.filter(r => r.permissions.includes(permission.id)).length} {t("roles")}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      
      {/* Role Details Dialog */}
      {selectedRole && (
        <Dialog open={!!selectedRole} onOpenChange={(open) => !open && setSelectedRole(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRole.name}</DialogTitle>
              <DialogDescription>{selectedRole.description}</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{t("Users with this role")}:</h4>
                <Badge>{selectedRole.userCount}</Badge>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">{t("Permissions")}:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRole.permissions.map(permId => {
                    const perm = permissions.find(p => p.id === permId);
                    return perm ? (
                      <div key={perm.id} className="flex items-start p-1 rounded bg-chess-dark/10">
                        <ShieldCheck className="h-4 w-4 mr-2 mt-0.5 text-chess-accent" />
                        <div>
                          <div className="text-sm font-mono">{perm.name}</div>
                          <div className="text-xs text-chess-text-light/70">{perm.description}</div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedRole(null)}
              >
                {t("Close")}
              </Button>
              {!selectedRole.isSystem && (
                <Button
                  onClick={() => {
                    editRole(selectedRole);
                    setSelectedRole(null);
                  }}
                >
                  {t("Edit Role")}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Create/Edit Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {roleFormData.id ? t("Edit Role") : t("Create New Role")}
            </DialogTitle>
            <DialogDescription>
              {t("Define role details and assign permissions")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleName" className="text-right">
                {t("Name")}
              </Label>
              <Input
                id="roleName"
                value={roleFormData.name}
                onChange={(e) => setRoleFormData({...roleFormData, name: e.target.value})}
                placeholder={t("Role name")}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roleDescription" className="text-right">
                {t("Description")}
              </Label>
              <Input
                id="roleDescription"
                value={roleFormData.description}
                onChange={(e) => setRoleFormData({...roleFormData, description: e.target.value})}
                placeholder={t("Brief description of this role")}
                className="col-span-3"
              />
            </div>
            
            <Separator className="my-2" />
            
            <h3 className="font-medium px-4">{t("Permissions")}</h3>
            
            <div className="px-4 space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(
                permissions.reduce((acc, perm) => {
                  if (!acc[perm.category]) acc[perm.category] = [];
                  acc[perm.category].push(perm);
                  return acc;
                }, {} as Record<string, Permission[]>)
              ).map(([category, perms]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-sm uppercase text-chess-text-light/70 capitalize">
                    {t(category)}
                  </h4>
                  
                  {perms.map(permission => (
                    <div key={permission.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`perm-${permission.id}`}
                        checked={roleFormData.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => {
                          setRoleFormData({
                            ...roleFormData,
                            permissions: checked
                              ? [...roleFormData.permissions, permission.id]
                              : roleFormData.permissions.filter(id => id !== permission.id)
                          });
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={`perm-${permission.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {permission.name}
                        </Label>
                        <p className="text-xs text-chess-text-light/70">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleRoleSubmit}
              disabled={!roleFormData.name}
            >
              {roleFormData.id ? t("Update Role") : t("Create Role")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("Delete Role")}</DialogTitle>
              <DialogDescription>
                {t("Are you sure you want to delete this role? This action cannot be undone.")}
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDelete(null)}
              >
                {t("Cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteRoleMutation.mutate(confirmDelete)}
              >
                {t("Delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default RolesAndPermissions;
