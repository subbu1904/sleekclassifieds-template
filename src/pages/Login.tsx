
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Facebook, Mail } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { PwaInstall } from "@/components/PwaInstall";

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
    try {
      // This would be an API call to your backend
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Mock successful response
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("user", JSON.stringify({ 
          name: "Demo User", 
          email: email 
        }));
        toast.success("Logged in successfully!");
        navigate("/profile");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // This would be implemented with actual OAuth flow in production
    try {
      // For Google, this would redirect to Google OAuth page
      // For Facebook, this would redirect to Facebook OAuth page
      
      // Example backend flow (not implemented here):
      // 1. Frontend redirects to OAuth provider (Google/Facebook)
      // 2. User authenticates with provider
      // 3. Provider redirects back to your app with an auth code
      // 4. Your app exchanges auth code for tokens with your backend
      // 5. Backend verifies tokens and creates/updates user record
      // 6. Backend returns session token to frontend
      
      // Simulate social login success
      setTimeout(() => {
        setIsLoading(false);
        const userData = provider === "Google" 
          ? { name: "Google User", email: "user@gmail.com", provider: "google" }
          : { name: "Facebook User", email: "user@facebook.com", provider: "facebook" };
          
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success(`Logged in with ${provider} successfully!`);
        navigate("/profile");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.error(`${provider} login failed. Please try again.`);
      console.error(`${provider} login error:`, error);
    }
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
                onClick={() => handleSocialLogin("Google")}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
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
        </Card>
      </main>
      <PwaInstall />
    </div>
  );
};

export default Login;
