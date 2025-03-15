
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";

interface ExpirySettingsProps {
  onExpiryChange: (date: Date | null) => void;
  onAutoRenewChange: (autoRenew: boolean) => void;
}

export const ExpirySettings = ({ onExpiryChange, onAutoRenewChange }: ExpirySettingsProps) => {
  const { t } = useLanguage();
  const [expiryDate, setExpiryDate] = useState<Date | null>(
    // Default to 30 days from now
    new Date(new Date().setDate(new Date().getDate() + 30))
  );
  const [autoRenew, setAutoRenew] = useState(false);

  const handleDateChange = (date: Date | undefined) => {
    const selectedDate = date || null;
    setExpiryDate(selectedDate);
    onExpiryChange(selectedDate);
  };

  const handleAutoRenewChange = (checked: boolean) => {
    setAutoRenew(checked);
    onAutoRenewChange(checked);
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-lg font-medium">{t('listings', 'expirySettings')}</h3>
      
      <div className="space-y-2">
        <Label htmlFor="expiry-date">{t('listings', 'expiryDate')}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !expiryDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {expiryDate ? format(expiryDate, "PPP") : <span>{t('listings', 'selectDate')}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={expiryDate || undefined}
              onSelect={handleDateChange}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <p className="text-sm text-muted-foreground">
          {t('listings', 'expiryDescription')}
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="auto-renew">{t('listings', 'autoRenew')}</Label>
          <p className="text-sm text-muted-foreground">
            {t('listings', 'autoRenewDescription')}
          </p>
        </div>
        <Switch
          id="auto-renew"
          checked={autoRenew}
          onCheckedChange={handleAutoRenewChange}
        />
      </div>
    </div>
  );
};
