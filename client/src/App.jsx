import React from "react";
import AppRoutes from "./Routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


const App = () => {
 
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};
export default App;
