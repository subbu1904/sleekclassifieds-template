
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

// Define window interface with SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface VoiceSearchProps {
  onSearchQuery: (query: string) => void;
}

export const VoiceSearch = ({ onSearchQuery }: VoiceSearchProps) => {
  const { t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error(t('search', 'voiceSearchNotSupported'));
      return;
    }

    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        toast.error(t('search', 'voiceSearchNotSupported'));
        return;
      }
      
      recognitionRef.current = new SpeechRecognitionAPI();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US'; // Default to English
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        setIsProcessing(true);
        const transcript = event.results[0][0].transcript;
        
        // Process the transcript
        setTimeout(() => {
          onSearchQuery(transcript);
          setIsListening(false);
          setIsProcessing(false);
          toast.success(`${t('search', 'searching')}: "${transcript}"`);
        }, 500);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setIsProcessing(false);
        toast.error(t('search', 'voiceSearchError'));
      };
      
      recognitionRef.current.onend = () => {
        if (!isProcessing) {
          setIsListening(false);
        }
      };
      
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast.error(t('search', 'voiceSearchError'));
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div>
      {isProcessing ? (
        <Button 
          variant="outline" 
          size="icon" 
          disabled
          className="relative"
        >
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      ) : isListening ? (
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={stopListening}
          className="animate-pulse"
        >
          <MicOff className="h-4 w-4" />
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={startListening}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
