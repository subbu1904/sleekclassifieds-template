
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFeatures, FeatureToggles } from "@/providers/FeaturesProvider";
import { useAdmin } from "@/providers/AdminProvider";
import { Shield, ToggleRight, Users, Database, LineChart, BellRing, MessageSquare, MapPin, Heart, FileVideo, Search, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const { isAdmin } = useAdmin();
  const { features, toggleFeature, enableAll, disableAll } = useFeatures();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [listingCount, setListingCount] = useState(0);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      toast.error("You don't have permission to access this page");
      return;
    }
    
    // In a real app, these would be fetched from an API
    // Simulating user and listing counts for the dashboard
    setUserCount(Math.floor(Math.random() * 100) + 50);
    setListingCount(Math.floor(Math.random() * 200) + 100);
  }, [isAdmin, navigate]);
  
  const featureIcons: Record<keyof FeatureToggles, React.ReactNode> = {
    geoLocation: <MapPin className="h-4 w-4" />,
    favorites: <Heart className="h-4 w-4" />,
    multimedia: <FileVideo className="h-4 w-4" />,
    advancedSearch: <Search className="h-4 w-4" />,
    notifications: <BellRing className="h-4 w-4" />,
    chat: <MessageSquare className="h-4 w-4" />,
    analytics: <LineChart className="h-4 w-4" />,
    verification: <CheckCircle className="h-4 w-4" />,
  };
  
  const featureLabels: Record<keyof FeatureToggles, string> = {
    geoLocation: "Geo Location",
    favorites: "Favorites/Wishlist",
    multimedia: "Multimedia Support",
    advancedSearch: "Advanced Search",
    notifications: "Notifications",
    chat: "Chat System",
    analytics: "Analytics",
    verification: "User Verification",
  };
  
  return (
    <div className="min-h-screen bg-muted/20">
      <Navigation />
      <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{listingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Features Enabled</CardTitle>
              <ToggleRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.values(features).filter(Boolean).length}/{Object.values(features).length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="features" className="space-y-4">
          <TabsList>
            <TabsTrigger value="features">Feature Toggles</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="content">Content Moderation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Feature Management</CardTitle>
                <CardDescription>
                  Enable or disable features across the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-end gap-4">
                  <Button variant="outline" size="sm" onClick={disableAll}>
                    Disable All
                  </Button>
                  <Button size="sm" onClick={enableAll}>
                    Enable All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(Object.keys(features) as Array<keyof FeatureToggles>).map((feature) => (
                    <div key={feature} className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          {featureIcons[feature]}
                        </div>
                        <Label htmlFor={`feature-${feature}`} className="flex flex-col space-y-1">
                          <span>{featureLabels[feature]}</span>
                          <span className="text-xs text-muted-foreground">
                            {features[feature] ? "Enabled" : "Disabled"}
                          </span>
                        </Label>
                      </div>
                      <Switch
                        id={`feature-${feature}`}
                        checked={features[feature]}
                        onCheckedChange={() => toggleFeature(feature)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  This feature will be implemented in the future
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">User management features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>
                  This feature will be implemented in the future
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Content moderation features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
