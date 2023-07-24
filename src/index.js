import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './style.css';
//Context
import { UserLogProvider } from "./Context/UserLogContext";
//Component
import App from "./App";

document.body.innerHTML = `<div id="root"></div>`;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserLogProvider>
        <App />
      </UserLogProvider>
    </BrowserRouter>
  </React.StrictMode>
);
