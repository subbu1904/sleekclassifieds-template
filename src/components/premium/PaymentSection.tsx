
import { PayPalButton } from "@/components/payment/PayPalButton";
import { useLanguage } from "@/providers/LanguageProvider";

interface PaymentSectionProps {
  selectedPlan: string;
  onPaymentSuccess: (details: any) => void;
}

export const PaymentSection = ({ selectedPlan, onPaymentSuccess }: PaymentSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">{t('premiumListing', 'completePayment')}</h3>
      <PayPalButton 
        amount={selectedPlan === "premium" ? 9.99 : 19.99}
        onSuccess={onPaymentSuccess}
      />
    </div>
  );
};
