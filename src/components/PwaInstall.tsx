
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, X, Phone } from "lucide-react";

export const PwaInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem("pwa-dismissed");
    if (dismissed) {
      setIsDismissed(true);
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      // We no longer need the prompt, clear it
      setInstallPrompt(null);
      setIsInstallable(false);
    });
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("pwa-dismissed", "true");
  };

  if ((!isInstallable && !isIOS) || isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-md p-4 shadow-lg bg-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-medium flex items-center">
              <Phone className="mr-2 h-5 w-5 text-[#2C9C8A]" />
              Install our app
            </h3>
            {isIOS ? (
              <p className="text-sm text-muted-foreground">
                Tap the share button and then "Add to Home Screen" to install
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Get a better experience by installing our app</p>
            )}
          </div>
          {!isIOS && (
            <Button 
              onClick={handleInstallClick} 
              className="flex-shrink-0 bg-[#2C9C8A] hover:bg-[#238276]"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Install
            </Button>
          )}
          <button 
            onClick={handleDismiss}
            className="rounded-full p-1 hover:bg-gray-100"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
};
