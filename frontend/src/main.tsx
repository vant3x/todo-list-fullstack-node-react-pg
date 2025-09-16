import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import ThemeState from './context/theme/ThemeState.tsx';
import AppState from './context/app/AppState.tsx';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeState>
          <AppState>
            <App />
          </AppState>
        </ThemeState>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
