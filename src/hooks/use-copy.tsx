
import { useState, useCallback, useEffect } from "react";

export const useCopy = () => {
  const [isCopied, setIsCopied] = useState(false);
  
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setIsCopied(true);
      })
      .catch((err) => {
        console.error("Could not copy text:", err);
      });
  }, []);
  
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isCopied]);
  
  return { copy, isCopied };
};
