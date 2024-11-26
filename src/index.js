import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import { ConnexionAdmin } from './Components/ConnexionAdmin/ConnexionAdmin';
import { AccueilAdmin } from './Components/AccueilAdmin/AccueilAdmin';
import { PrivateRoute } from './Components/PrivateRoute/PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="connexion-admin" element={<ConnexionAdmin />} />
            <Route path="accueil-admin" element={
              <PrivateRoute>
                <AccueilAdmin />
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
