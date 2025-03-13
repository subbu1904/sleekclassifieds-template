
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Facebook, Github, Mail } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    // Simulate login - would connect to backend in a real implementation
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify({ 
        name: "Demo User", 
        email: email 
      }));
      toast.success("Logged in successfully!");
      navigate("/profile");
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate social login - would connect to a real provider in a real implementation
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify({ 
        name: `${provider} User`, 
        email: `user@${provider.toLowerCase()}.com` 
      }));
      toast.success(`Logged in with ${provider} successfully!`);
      navigate("/profile");
    }, 1000);
  };
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('auth', 'login')}</CardTitle>
            <CardDescription>
              {t('auth', 'welcomeBack')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleSocialLogin("Facebook")}
                disabled={isLoading}
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => handleSocialLogin("Github")}
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-2 text-sm text-muted-foreground">
                  {t('auth', 'orContinueWith')}
                </span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth', 'email')}</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth', 'password')}</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('auth', 'loggingIn') : t('auth', 'login')}
                </Button>
              </div>
            </form>
            
            <div className="text-sm text-center mt-4">
              {t('auth', 'dontHaveAccount')}{" "}
              <Link to="/register" className="text-primary underline">
                {t('auth', 'registerHere')}
              </Link>
            </div>
          </CardContent>
        </CardContent>
      </Card>
    </main>
  </div>
  );
};

export default Login;
