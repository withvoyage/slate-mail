import "./demo.css";

import React from "react";

import ReactDOM from "react-dom/client";
import { SlateProvider } from "slate-ui";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SlateProvider>
      <App />
    </SlateProvider>
  </React.StrictMode>
);
