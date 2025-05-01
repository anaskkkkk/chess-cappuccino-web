import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, MoreVertical, Plus, Download, Eye, Edit, Trash2, Ban, ShieldAlert, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useLanguageContext } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

// Sample user data
const USERS = [
  {
    id: "u1",
    name: "Sofia Rodriguez",
    email: "sofia@example.com",
    role: "Admin",
    status: "active", 
    createdAt: "2024-01-05",
    lastLogin: "2025-04-30",
    image: null,
  },
  {
    id: "u2",
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    role: "User",
    status: "active",
    createdAt: "2024-02-15",
    lastLogin: "2025-04-29",
    image: null,
  },
  {
    id: "u3",
    name: "Michael Chen",
    email: "michael@example.com",
    role: "Moderator",
    status: "active",
    createdAt: "2024-03-10",
    lastLogin: "2025-04-28", 
    image: null,
  },
  {
    id: "u4",
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "User",
    status: "suspended",
    createdAt: "2024-01-20",
    lastLogin: "2025-03-15",
    image: null,
  },
  {
    id: "u5",
    name: "Liam Johnson",
    email: "liam@example.com",
    role: "User",
    status: "active",
    createdAt: "2024-04-01",
    lastLogin: "2025-04-30",
    image: null,
  },
  {
    id: "u6",
    name: "Zara Khan",
    email: "zara@example.com", 
    role: "Premium",
    status: "active",
    createdAt: "2024-02-22",
    lastLogin: "2025-04-29",
    image: null, 
  },
  {
    id: "u7",
    name: "Carlos Mendoza",
    email: "carlos@example.com",
    role: "User",
    status: "inactive",
    createdAt: "2023-12-15",
    lastLogin: "2025-02-01",
    image: null,
  },
  {
    id: "u8",
    name: "Anna Petrova",
    email: "anna@example.com",
    role: "Premium",
    status: "active", 
    createdAt: "2024-03-30",
    lastLogin: "2025-04-30",
    image: null,
  },
  {
    id: "u9",
    name: "David Kim",
    email: "david@example.com", 
    role: "User",
    status: "active",
    createdAt: "2024-01-10",
    lastLogin: "2025-04-25",
    image: null,
  },
  {
    id: "u10",
    name: "Olivia Taylor",
    email: "olivia@example.com",
    role: "Moderator",
    status: "active",
    createdAt: "2024-02-05",
    lastLogin: "2025-04-28",
    image: null,
  },
];

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof USERS[0] | null>(null);
  const { t } = useLanguageContext();
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = USERS.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDelete = (userId: string) => {
    toast({
      title: "User deleted",
      description: `User ID: ${userId} has been deleted.`,
    });
  };

  const handleEdit = (user: typeof USERS[0]) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleSuspend = (userId: string) => {
    toast({
      title: "User suspended",
      description: `User ID: ${userId} has been suspended.`,
    });
  };

  const handleStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-gray-400 border-gray-400">Inactive</Badge>;
      default:
        return null;
    }
  };

  const handleRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-purple-600 hover:bg-purple-700">Admin</Badge>;
      case "Moderator":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Moderator</Badge>;
      case "Premium":
        return <Badge className="bg-chess-accent hover:bg-chess-accent/90">Premium</Badge>;
      default:
        return <Badge variant="outline" className="border-gray-400 text-gray-300">User</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-chess-text-light">User Management</h2>
          <p className="text-gray-400">Manage and monitor user accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-chess-text-light border-white/10">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <TabsList className="bg-white/5">
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="suspended">Suspended</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-chess-dark border-white/10 text-chess-text-light"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button variant="outline" size="icon" className="border-white/10">
              <Filter className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card className="bg-chess-dark border-white/10">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-white/5 border-white/10">
                    <TableHead className="text-gray-400">User</TableHead>
                    <TableHead className="text-gray-400">Role</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Joined</TableHead>
                    <TableHead className="text-gray-400">Last Active</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-white/5 border-white/10">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-chess-accent/20 text-chess-accent">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-chess-text-light">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{handleRoleBadge(user.role)}</TableCell>
                        <TableCell>{handleStatusBadge(user.status)}</TableCell>
                        <TableCell className="text-gray-400">{user.createdAt}</TableCell>
                        <TableCell className="text-gray-400">{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-400">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-chess-dark border-white/10 text-chess-text-light">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => handleEdit(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => {}}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => {}}>
                                <Mail className="h-4 w-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-white/10" onClick={() => {}}>
                                <ShieldAlert className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="cursor-pointer text-amber-500 hover:bg-white/10" onClick={() => handleSuspend(user.id)}>
                                <Ban className="h-4 w-4 mr-2" />
                                {user.status === "suspended" ? "Reactivate" : "Suspend"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-red-500 hover:bg-white/10" onClick={() => handleDelete(user.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="hover:bg-white/5 border-white/10">
                      <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tab contents would be similar but filtered */}
        <TabsContent value="active" className="mt-0">
          <Card className="bg-chess-dark border-white/10">
            <CardHeader>
              <CardTitle className="text-chess-text-light">Active Users</CardTitle>
              <CardDescription>Users who are currently active in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table to above but filtered for active users */}
              <p className="text-gray-400">Showing active users only</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add User Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-[500px] bg-chess-dark border-white/10 text-chess-text-light">
            <DialogHeader>
              <DialogTitle className="text-chess-text-light">Add New User</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a new user account in the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-chess-text-light">Name</Label>
                <Input id="name" placeholder="Full name" className="bg-chess-dark border-white/20" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-chess-text-light">Email</Label>
                <Input id="email" type="email" placeholder="Email address" className="bg-chess-dark border-white/20" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-chess-text-light">Role</Label>
                <Input id="role" placeholder="User role" className="bg-chess-dark border-white/20" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-white/20" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "User created",
                  description: "New user has been successfully created.",
                });
                setShowCreateDialog(false);
              }}>
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[500px] bg-chess-dark border-white/10 text-chess-text-light">
            <DialogHeader>
              <DialogTitle className="text-chess-text-light">Edit User</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update user information
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name" className="text-chess-text-light">Name</Label>
                  <Input id="edit-name" defaultValue={selectedUser.name} className="bg-chess-dark border-white/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email" className="text-chess-text-light">Email</Label>
                  <Input id="edit-email" type="email" defaultValue={selectedUser.email} className="bg-chess-dark border-white/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-role" className="text-chess-text-light">Role</Label>
                  <Input id="edit-role" defaultValue={selectedUser.role} className="bg-chess-dark border-white/20" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status" className="text-chess-text-light">Status</Label>
                  <Input id="edit-status" defaultValue={selectedUser.status} className="bg-chess-dark border-white/20" />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" className="border-white/20" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "User updated",
                  description: "User information has been successfully updated.",
                });
                setShowEditDialog(false);
              }}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Tabs>
    </div>
  );
};

export default UserManagement;
