import React from "react";
import AppRoutes from "./Routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";



const App = () => {
 
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>

  );
};
export default App;
