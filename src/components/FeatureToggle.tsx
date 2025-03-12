
import React from "react";
import { useFeatures } from "@/providers/FeaturesProvider";
import type { FeatureToggles } from "@/providers/FeaturesProvider";

interface FeatureToggleProps {
  feature: keyof FeatureToggles;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureToggle: React.FC<FeatureToggleProps> = ({
  feature,
  children,
  fallback = null,
}) => {
  const { features } = useFeatures();
  
  if (features[feature]) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
