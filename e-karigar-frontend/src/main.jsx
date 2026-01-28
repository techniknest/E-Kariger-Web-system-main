import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './theme';
import GlobalStyles from './styles/GlobalStyles';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { DataProvider } from './context/DataContext';
import App from './App';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <BrowserRouter>
        <AuthProvider>
          <UIProvider>
            <DataProvider>
              <App />
            </DataProvider>
          </UIProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);