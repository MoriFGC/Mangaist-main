import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-6zpiulqlj7s17isb.eu.auth0.com"
      clientId="ZTKjkfL7HvuvnkLGFGsrqxtEszZbrrIg"
      authorizationParams={{
        redirect_uri: "http://localhost:5173"
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)