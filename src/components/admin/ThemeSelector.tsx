
import { useTheme } from "@/providers/ThemeProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

export const ThemeSelector = () => {
  const { theme, setTheme, themes } = useTheme();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <span>Theme Settings</span>
        </CardTitle>
        <CardDescription>
          Customize the look and feel of the application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={theme} onValueChange={(value) => setTheme(value as any)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((themOption) => (
              <div key={themOption.id} className="flex items-start space-x-2">
                <RadioGroupItem value={themOption.id} id={`theme-${themOption.id}`} />
                <div className="grid gap-1.5">
                  <Label htmlFor={`theme-${themOption.id}`} className="font-medium">
                    {themOption.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {themOption.description}
                  </p>
                  <div 
                    className="w-8 h-8 rounded-full border border-border mt-1"
                    style={{ 
                      backgroundColor: themOption.primaryColor,
                      boxShadow: theme === themOption.id ? '0 0 0 2px var(--ring)' : 'none' 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
