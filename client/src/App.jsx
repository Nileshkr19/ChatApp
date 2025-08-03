import React, { useEffect } from "react";
import AppRoutes from "./Routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { Provider } from "react-redux";
import {store} from "./app/store.js";


const App = () => {
  

  return (
    <Provider store={store}>
    <ThemeProvider defaultTheme="dark" storageKey="chatflow-ui-theme">
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </ThemeProvider>
    </Provider>
  );
};
export default App;
