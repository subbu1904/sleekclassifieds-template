
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useCopy } from "@/hooks/use-copy";
import { Share2, Users, Percent, Trophy, Info } from "lucide-react";
import { useCurrency } from "@/providers/CurrencyProvider";

export const AffiliateProgram = () => {
  const { formatPrice } = useCurrency();
  const { copy, isCopied } = useCopy();
  
  const referralLink = `${window.location.origin}?ref=USER123`;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            <span>Affiliate & Referral Program</span>
          </CardTitle>
          <CardDescription>
            Manage your affiliate program settings and view referral statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Program Settings</TabsTrigger>
              <TabsTrigger value="affiliates">Affiliate Management</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Total Affiliates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">124</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Total Referrals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">783</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Commission Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatPrice(4129.75)}</div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Your Referral Link</h3>
                    <p className="text-sm text-muted-foreground">Share this link to earn commissions</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input value={referralLink} readOnly className="flex-1" />
                    <Button 
                      onClick={() => copy(referralLink)} 
                      variant={isCopied ? "outline" : "default"}
                    >
                      {isCopied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Enable Affiliate Program</h3>
                    <p className="text-sm text-muted-foreground">
                      Allow users to earn commissions by referring new customers
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Commission Structure</h3>
                  
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-level">First Level Commission (%)</Label>
                        <Input id="first-level" type="number" defaultValue="10" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="second-level">Second Level Commission (%)</Label>
                        <Input id="second-level" type="number" defaultValue="5" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="conversion-period">Conversion Tracking Period (days)</Label>
                      <Input id="conversion-period" type="number" defaultValue="30" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="min-payout">Minimum Payout Amount ({formatPrice(1)})</Label>
                      <Input id="min-payout" type="number" defaultValue="50" />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="affiliates">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-3">
                      <Info className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium">Affiliate Management</h3>
                      <p className="text-muted-foreground max-w-md">
                        View and manage your affiliates, track performance, and 
                        set custom commission rates for individual partners.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payouts">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-3">
                      <Info className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium">Payout Management</h3>
                      <p className="text-muted-foreground max-w-md">
                        Review pending payouts, process payments, and view payout history 
                        for your affiliate partners.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
