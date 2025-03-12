
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface User {
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  location?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      toast.error("Please login to view your profile");
      return;
    }
    
    setUser(JSON.parse(storedUser));
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };
  
  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      ...user,
      name: formData.get("name") as string,
      bio: formData.get("bio") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
    };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success("Profile updated successfully");
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Account</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="https://ui.shadcn.com/avatars/03.png" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="flex flex-col w-full mt-4">
                <Button variant="outline" className="mb-2">My Listings</Button>
                <Button variant="outline" className="mb-2">Favorites</Button>
                <Button variant="outline">Messages</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="account">
                <TabsList className="mb-4">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account">
                  <form onSubmit={handleProfileUpdate}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" disabled value={user.email} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          name="bio" 
                          defaultValue={user.bio || ""}
                          placeholder="Tell us a bit about yourself" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            defaultValue={user.phone || ""} 
                            placeholder="+1 (555) 000-0000" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            name="location" 
                            defaultValue={user.location || ""} 
                            placeholder="City, State" 
                          />
                        </div>
                      </div>
                      
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <div className="text-center py-8 text-gray-500">
                    Notification settings will be implemented in the future
                  </div>
                </TabsContent>
                
                <TabsContent value="security">
                  <div className="text-center py-8 text-gray-500">
                    Security settings will be implemented in the future
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
