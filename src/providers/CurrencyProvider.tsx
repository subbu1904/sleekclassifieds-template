
import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "JPY";

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate relative to USD
  position: "prefix" | "suffix";
}

export const currencyData: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", exchangeRate: 1, position: "prefix" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", exchangeRate: 0.93, position: "prefix" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", exchangeRate: 0.81, position: "prefix" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", exchangeRate: 83.27, position: "prefix" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", exchangeRate: 156.35, position: "prefix" },
};

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (currencyCode: CurrencyCode) => void;
  formatPrice: (amount: number) => string;
  convertPrice: (amountInUSD: number) => number;
  availableCurrencies: CurrencyInfo[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(() => {
    const savedCurrency = localStorage.getItem("appCurrency");
    return (savedCurrency as CurrencyCode) || "USD";
  });

  useEffect(() => {
    localStorage.setItem("appCurrency", currencyCode);
  }, [currencyCode]);

  const currency = currencyData[currencyCode];

  const setCurrency = (newCurrencyCode: CurrencyCode) => {
    setCurrencyCode(newCurrencyCode);
  };

  const formatPrice = (amount: number): string => {
    const convertedAmount = convertPrice(amount);
    const formattedAmount = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(convertedAmount);

    return currency.position === "prefix" 
      ? `${currency.symbol}${formattedAmount}` 
      : `${formattedAmount} ${currency.symbol}`;
  };

  const convertPrice = (amountInUSD: number): number => {
    return amountInUSD * currency.exchangeRate;
  };

  const availableCurrencies = Object.values(currencyData);

  return (
    <CurrencyContext.Provider 
      value={{ 
        currency, 
        setCurrency, 
        formatPrice, 
        convertPrice,
        availableCurrencies
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
