
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the features that can be toggled
export interface FeatureToggles {
  geoLocation: boolean;
  favorites: boolean;
  multimedia: boolean;
  advancedSearch: boolean;
  notifications: boolean;
  chat: boolean;
  analytics: boolean;
  verification: boolean;
}

interface FeaturesContextType {
  features: FeatureToggles;
  toggleFeature: (feature: keyof FeatureToggles) => void;
  enableAll: () => void;
  disableAll: () => void;
}

const defaultFeatures: FeatureToggles = {
  geoLocation: true,
  favorites: true,
  multimedia: true,
  advancedSearch: true,
  notifications: false,
  chat: false,
  analytics: false,
  verification: false,
};

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export const FeaturesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<FeatureToggles>(() => {
    const savedFeatures = localStorage.getItem("featureToggles");
    return savedFeatures ? JSON.parse(savedFeatures) : defaultFeatures;
  });

  useEffect(() => {
    localStorage.setItem("featureToggles", JSON.stringify(features));
  }, [features]);

  const toggleFeature = (feature: keyof FeatureToggles) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  const enableAll = () => {
    const allEnabled = Object.keys(features).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as FeatureToggles
    );
    setFeatures(allEnabled);
  };

  const disableAll = () => {
    const allDisabled = Object.keys(features).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as FeatureToggles
    );
    setFeatures(allDisabled);
  };

  return (
    <FeaturesContext.Provider value={{ features, toggleFeature, enableAll, disableAll }}>
      {children}
    </FeaturesContext.Provider>
  );
};

export const useFeatures = () => {
  const context = useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error("useFeatures must be used within a FeaturesProvider");
  }
  return context;
};
