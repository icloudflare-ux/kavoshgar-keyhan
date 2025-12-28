
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { TimeZoneProvider } from './contexts/TimeZoneContext';
import { AuthProvider } from './contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CosmicLibraryProvider } from './contexts/CosmicLibraryContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './contexts/ToastContext';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import './i18n'; // Initialize i18next
import './index.css'; // Ensure CSS is imported

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <TimeZoneProvider>
          <ThemeProvider>
            <AuthProvider>
              <CosmicLibraryProvider>
                <SettingsProvider>
                  <ToastProvider>
                    <AudioPlayerProvider>
                      <App />
                    </AudioPlayerProvider>
                  </ToastProvider>
                </SettingsProvider>
              </CosmicLibraryProvider>
            </AuthProvider>
          </ThemeProvider>
        </TimeZoneProvider>
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>
);