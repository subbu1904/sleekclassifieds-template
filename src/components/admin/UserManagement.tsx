
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, Ban, Loader2, Mail, Shield, MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_verified: boolean;
  status: 'active' | 'suspended';
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch actual user data
        // For demo purposes, we'll create mock data
        
        // Try to get some real users if they exist
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, updated_at');
        
        // Create mock data based on real profiles or generate if none exist
        const mockUsers: User[] = profiles?.length ? 
          profiles.map((profile, index) => ({
            id: profile.id,
            email: `user${index + 1}@example.com`,
            full_name: profile.full_name || `User ${index + 1}`,
            created_at: profile.updated_at || new Date().toISOString(),
            last_sign_in_at: Math.random() > 0.3 ? new Date().toISOString() : null,
            is_verified: Math.random() > 0.2,
            status: Math.random() > 0.1 ? 'active' : 'suspended'
          })) :
          Array.from({ length: 20 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            return {
              id: `user-${i + 1}`,
              email: `user${i + 1}@example.com`,
              full_name: `User ${i + 1}`,
              created_at: date.toISOString(),
              last_sign_in_at: Math.random() > 0.3 ? new Date().toISOString() : null,
              is_verified: Math.random() > 0.2,
              status: Math.random() > 0.1 ? 'active' : 'suspended'
            };
          });
        
        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const toggleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };
  
  const handleBulkAction = (action: 'verify' | 'suspend' | 'delete' | 'email') => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users first");
      return;
    }
    
    // In a real app, this would call an API endpoint
    toast.success(`${action} action applied to ${selectedUsers.length} users`);
    
    // Simulate the action for the UI
    if (action === 'verify') {
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) ? {...user, is_verified: true} : user
      ));
    } else if (action === 'suspend') {
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) ? {...user, status: 'suspended' as const} : user
      ));
    } else if (action === 'delete') {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage users, verify accounts and moderate activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[250px]"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('verify')}
                disabled={selectedUsers.length === 0}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Verify
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('suspend')}
                disabled={selectedUsers.length === 0}
              >
                <Ban className="h-4 w-4 mr-2" />
                Suspend
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('email')}
                disabled={selectedUsers.length === 0}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkAction('delete')}>
                    <UserX className="h-4 w-4 mr-2" />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} 
                      onCheckedChange={toggleSelectAll} 
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)} 
                          onCheckedChange={() => toggleSelectUser(user.id)} 
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={user.status === 'active' ? "outline" : "destructive"}>
                            {user.status}
                          </Badge>
                          {user.is_verified && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Check className="h-3 w-3" /> Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Verify
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Ban className="h-4 w-4 mr-2" />
                              {user.status === 'active' ? 'Suspend' : 'Activate'}
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
      </CardContent>
    </Card>
  );
};
