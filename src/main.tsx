
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/providers/AuthProvider';
import { FeaturesProvider } from '@/providers/FeaturesProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { WishlistProvider } from '@/providers/WishlistProvider';
import { AdminProvider } from '@/providers/AdminProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { CurrencyProvider } from '@/providers/CurrencyProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FeaturesProvider>
            <LanguageProvider>
              <WishlistProvider>
                <AdminProvider>
                  <ThemeProvider>
                    <CurrencyProvider>
                      <App />
                      <Toaster position="top-right" />
                    </CurrencyProvider>
                  </ThemeProvider>
                </AdminProvider>
              </WishlistProvider>
            </LanguageProvider>
          </FeaturesProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
