import React from "react";
import AppRoutes from "./Routes/AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store,persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";



const App = () => {
 
  return (
    <Provider store={store}>

        <PersistGate loading={null} persistor={persistor}>
      <Router>
        <AppRoutes />
      </Router>
        </PersistGate>
    </Provider>

  );
};
export default App;
