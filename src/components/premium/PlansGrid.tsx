
import { PlanCard } from "./PlanCard";
import { Plan, PlanFeature } from "./types";

interface PlansGridProps {
  plans: Plan[];
  features: PlanFeature[];
  selectedPlan: string | null;
  paymentComplete: boolean;
  onSelectPlan: (planId: string) => void;
}

export const PlansGrid = ({ 
  plans, 
  features, 
  selectedPlan, 
  paymentComplete, 
  onSelectPlan 
}: PlansGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          features={features}
          selectedPlan={selectedPlan}
          paymentComplete={paymentComplete}
          onSelectPlan={onSelectPlan}
        />
      ))}
    </div>
  );
};
