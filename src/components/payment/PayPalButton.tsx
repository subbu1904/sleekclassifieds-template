
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PayPalButtonProps {
  amount: number;
  onSuccess: (details: any) => void;
  onError?: (error: Error) => void;
  currency?: string;
  showSpinner?: boolean;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export const PayPalButton = ({
  amount,
  onSuccess,
  onError,
  currency = "USD",
  showSpinner = true,
}: PayPalButtonProps) => {
  const [loading, setLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [buttonRendered, setButtonRendered] = useState(false);

  // Load the PayPal SDK script
  useEffect(() => {
    const addPayPalScript = () => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=sb&currency=${currency}`;
      script.async = true;
      script.onload = () => {
        setScriptLoaded(true);
        setLoading(false);
      };
      script.onerror = () => {
        setLoading(false);
        toast.error("Failed to load PayPal SDK");
        if (onError) onError(new Error("Failed to load PayPal SDK"));
      };
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPayPalScript();
    } else {
      setScriptLoaded(true);
      setLoading(false);
    }

    return () => {
      // Clean up if component unmounts before script loads
      const script = document.querySelector('script[src*="paypal"]');
      if (script) {
        script.remove();
      }
    };
  }, [currency, onError]);

  // Render the PayPal button
  useEffect(() => {
    if (scriptLoaded && !buttonRendered && window.paypal) {
      try {
        const paypalButtonContainer = document.getElementById("paypal-button-container");
        if (paypalButtonContainer) {
          // Clear any existing buttons
          paypalButtonContainer.innerHTML = "";
          
          window.paypal.Buttons({
            style: {
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "pay",
            },
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: amount.toString(),
                      currency_code: currency,
                    },
                    description: "Premium Listing",
                  },
                ],
              });
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                toast.success(`Transaction completed by ${details.payer.name.given_name}`);
                onSuccess(details);
              });
            },
            onError: (err: Error) => {
              toast.error("Payment failed");
              if (onError) onError(err);
            },
          }).render("#paypal-button-container");
          
          setButtonRendered(true);
        }
      } catch (error) {
        console.error("Error rendering PayPal buttons:", error);
        toast.error("Failed to render PayPal button");
        if (onError) onError(error as Error);
      }
    }
  }, [scriptLoaded, buttonRendered, amount, currency, onSuccess, onError]);

  // For development/testing when PayPal isn't available
  const handleDevPayment = () => {
    toast.success("Development payment successful!");
    onSuccess({ id: `dev-${Date.now()}`, status: "COMPLETED" });
  };

  return (
    <Card>
      <CardContent className="p-4">
        {loading && showSpinner ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <div id="paypal-button-container" className="min-h-[45px]"></div>
            
            {/* Development fallback button */}
            {process.env.NODE_ENV === "development" && !buttonRendered && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2 text-center">
                  PayPal SDK not loaded (dev mode)
                </p>
                <Button 
                  onClick={handleDevPayment} 
                  className="w-full bg-[#0070ba] hover:bg-[#003087]"
                >
                  Pay with PayPal (Dev Mode)
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
