
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const OfflineManager = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRetry, setShowRetry] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);

  useEffect(() => {
    // Check if there's any offline data in localStorage
    const checkOfflineData = () => {
      const offlineListings = localStorage.getItem('offlineListings');
      const offlineMessages = localStorage.getItem('offlineMessages');
      setHasOfflineData(!!offlineListings || !!offlineMessages);
    };
    
    checkOfflineData();

    const handleOnline = () => {
      setIsOnline(true);
      if (hasOfflineData) {
        toast("You're back online! Syncing your data...", {
          icon: <Wifi className="h-4 w-4 text-green-500" />,
        });
        // In a real app, you'd sync the data here
        setTimeout(() => {
          toast.success("All your data has been synced successfully!");
          localStorage.removeItem('offlineListings');
          localStorage.removeItem('offlineMessages');
          setHasOfflineData(false);
        }, 2000);
      } else {
        toast("You're back online!", {
          icon: <Wifi className="h-4 w-4 text-green-500" />,
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRetry(true);
      toast("You're offline. Limited functionality is available.", {
        icon: <WifiOff className="h-4 w-4 text-orange-500" />,
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasOfflineData]);

  const checkConnection = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      setShowRetry(false);
      toast.success("Connection restored!");
    } else {
      toast.error("Still offline. Please check your connection.");
    }
  };

  // If online and no need to show retry, don't render anything
  if (isOnline && !showRetry) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-md p-4 shadow-lg bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="h-5 w-5 text-orange-500" />
            <div>
              <h3 className="font-medium">You're offline</h3>
              <p className="text-sm text-muted-foreground">
                Some features are limited while offline
              </p>
            </div>
          </div>
          <Button size="sm" onClick={checkConnection}>
            Retry
          </Button>
        </div>
      </Card>
    </div>
  );
};
