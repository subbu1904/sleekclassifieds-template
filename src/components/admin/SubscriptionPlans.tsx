
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Package, FileText, Stars, CheckCircle2, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useCurrency } from "@/providers/CurrencyProvider";
import { useState } from "react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  description: string;
  features: string[];
  isPopular?: boolean;
}

export const SubscriptionPlans = () => {
  const { formatPrice } = useCurrency();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: "basic",
      name: "Basic",
      price: 9.99,
      interval: "monthly",
      description: "Perfect for casual users and beginners",
      features: [
        "Up to 10 listings",
        "Standard listing visibility",
        "Basic analytics",
        "Email support"
      ]
    },
    {
      id: "pro",
      name: "Professional",
      price: 24.99,
      interval: "monthly",
      description: "For power users and small businesses",
      features: [
        "Up to 50 listings",
        "Premium listing placement",
        "Advanced analytics",
        "Priority email support",
        "Featured listings",
        "Category boosts"
      ],
      isPopular: true
    },
    {
      id: "business",
      name: "Business",
      price: 49.99,
      interval: "monthly",
      description: "For businesses with high volume needs",
      features: [
        "Unlimited listings",
        "Premium listing placement",
        "Complete analytics suite",
        "Dedicated account manager",
        "Featured listings",
        "Category boosts",
        "API access",
        "Custom branding"
      ]
    }
  ]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span>Subscription Plans</span>
          </CardTitle>
          <CardDescription>
            Manage subscription plans and membership tiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="plans" className="space-y-4">
            <TabsList>
              <TabsTrigger value="plans">Plan Management</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              <TabsTrigger value="analytics">Subscription Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="plans" className="space-y-4">
              <div className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Add New Plan</span>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <ScrollArea className="h-[700px] pr-4">
                  {plans.map((plan) => (
                    <Card key={plan.id} className="mb-6 relative">
                      {plan.isPopular && (
                        <Badge 
                          className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/2 bg-amber-500"
                        >
                          Most Popular
                        </Badge>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">
                              {formatPrice(plan.price)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              per {plan.interval}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-3">Features</h4>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center">
                            <Label htmlFor={`active-${plan.id}`} className="mr-2">
                              Active
                            </Label>
                            <Switch id={`active-${plan.id}`} defaultChecked />
                          </div>
                          <div className="space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="subscribers">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-3">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium">Subscriber Management</h3>
                      <p className="text-muted-foreground max-w-md">
                        View and manage your subscribers, track billing status, 
                        and handle subscription changes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-3">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-medium">Subscription Analytics</h3>
                      <p className="text-muted-foreground max-w-md">
                        Track revenue, churn rate, and other key metrics for your 
                        subscription plans.
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
