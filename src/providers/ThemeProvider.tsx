
import React, { createContext, useContext, useState, useEffect } from "react";

// Define theme types
export type ThemeType = "default" | "dark" | "light" | "colorful" | "minimal";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  themes: { id: ThemeType; name: string; description: string; primaryColor: string }[];
}

const themes = [
  { 
    id: "default" as ThemeType, 
    name: "Default Theme", 
    description: "The standard look and feel", 
    primaryColor: "var(--primary)" 
  },
  { 
    id: "dark" as ThemeType, 
    name: "Dark Mode", 
    description: "High contrast dark theme", 
    primaryColor: "#1e1e2e" 
  },
  { 
    id: "light" as ThemeType, 
    name: "Light Mode", 
    description: "Bright and clean interface", 
    primaryColor: "#f8fafc" 
  },
  { 
    id: "colorful" as ThemeType, 
    name: "Colorful", 
    description: "Vibrant and energetic", 
    primaryColor: "#6366f1" 
  },
  { 
    id: "minimal" as ThemeType, 
    name: "Minimal", 
    description: "Clean and minimalistic", 
    primaryColor: "#94a3b8" 
  }
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem("appTheme");
    return (savedTheme as ThemeType) || "default";
  });

  useEffect(() => {
    localStorage.setItem("appTheme", theme);
    
    // Remove all theme classes
    document.documentElement.classList.remove("theme-default", "theme-dark", "theme-light", "theme-colorful", "theme-minimal");
    
    // Add the current theme class
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
