
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
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { user, profile, signOut, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      toast.error("Please login to view your profile");
    }
  }, [user, isLoading, navigate]);
  
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) return;
    
    setUpdating(true);
    const formData = new FormData(e.currentTarget);
    
    const updates = {
      id: user.id,
      full_name: formData.get("name") as string,
      avatar_url: profile?.avatar_url || null,
      updated_at: new Date().toISOString()
    };
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });
        
      if (error) {
        throw error;
      }
      
      await refreshProfile();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error("Error updating profile: " + error.message);
      console.error("Error updating profile:", error);
    } finally {
      setUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user || !profile) return null;
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">My Account</h1>
          <Button variant="outline" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardContent className="pt-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile.avatar_url || "https://ui.shadcn.com/avatars/03.png"} />
                <AvatarFallback>{profile.full_name?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{profile.full_name || "User"}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className="flex flex-col w-full mt-4">
                <Button variant="outline" className="mb-2" onClick={() => navigate("/my-listings")}>My Listings</Button>
                <Button variant="outline" className="mb-2" onClick={() => navigate("/wishlist")}>Favorites</Button>
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
                          <Input 
                            id="name" 
                            name="name" 
                            defaultValue={profile.full_name || ""} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" disabled value={user.email || ""} />
                        </div>
                      </div>
                      
                      <Button type="submit" disabled={updating}>
                        {updating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
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
