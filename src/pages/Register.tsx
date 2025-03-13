
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/providers/LanguageProvider";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // Simulate registration - would connect to backend in a real implementation
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify({ name, email }));
      toast.success("Account created successfully!");
      navigate("/profile");
    }, 1000);
  };
  
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('auth', 'createAccount')}</CardTitle>
            <CardDescription>
              {t('auth', 'joinMarketplace')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('auth', 'fullName')}</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth', 'email')}</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth', 'password')}</Label>
                <Input id="password" name="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('auth', 'creatingAccount') : t('auth', 'createAccount')}
              </Button>
              <div className="text-sm text-center mt-4">
                {t('auth', 'alreadyHaveAccount')}{" "}
                <Link to="/login" className="text-primary underline">
                  {t('auth', 'loginHere')}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default Register;
