import React from 'react'
import AppRoutes from './Routes/AppRoutes';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorBoundary from './utils/ErrorBoundary';
import { ThemeProvider } from './context/ThemeProvider.jsx';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="chatflow-ui-theme">
    <ErrorBoundary>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
    </ErrorBoundary>
    </ThemeProvider>
  )
}
export default App