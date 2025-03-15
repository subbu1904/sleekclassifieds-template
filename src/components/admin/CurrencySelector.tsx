
import { useCurrency, CurrencyCode } from "@/providers/CurrencyProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BadgeDollarSign } from "lucide-react";

export const CurrencySelector = () => {
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BadgeDollarSign className="h-5 w-5" />
          <span>Currency Settings</span>
        </CardTitle>
        <CardDescription>
          Set the default currency for all prices on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={currency.code} 
          onValueChange={(value) => setCurrency(value as CurrencyCode)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCurrencies.map((currencyOption) => (
              <div key={currencyOption.code} className="flex items-start space-x-2">
                <RadioGroupItem 
                  value={currencyOption.code} 
                  id={`currency-${currencyOption.code}`} 
                />
                <div className="grid gap-1.5">
                  <Label 
                    htmlFor={`currency-${currencyOption.code}`} 
                    className="font-medium flex items-center gap-2"
                  >
                    <span className="text-lg">{currencyOption.symbol}</span> 
                    {currencyOption.name} ({currencyOption.code})
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Exchange rate: 1 USD = {currencyOption.exchangeRate} {currencyOption.code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
