import React from 'react'
import AppRoutes from './Routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './utils/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
    </ErrorBoundary>
  )
}
export default App