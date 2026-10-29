import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/ui.css";
import "./styles/layout.css";
import "./styles/dataviz.css";

createRoot(document.querySelector("#root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
