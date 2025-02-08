import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
  domain="dev-j0zlk7gogm1b2ben.us.auth0.com"
  clientId="ffe47fxGRhuze07vSOfbagpinW4Hnz0w"
  authorizationParams={{
    redirect_uri: window.location.origin,
    audience: "http://localhost:3001",
    scope: "openid profile email read:books read:authors",
  }}
>
    <App />
  </Auth0Provider>
);
