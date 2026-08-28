import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
/* Runway DLS §5.1 — Lato, the sole typeface. Imported before the token and
   component styles so the @font-face rules are registered ahead of any
   fontFamily reference (usage guide §4 Font Loading Verification).
   Weights match those declared in the DLS weight scale (§5.3). */
import "@fontsource/lato/300.css";
import "@fontsource/lato/400.css";
import "@fontsource/lato/700.css";
import "@fontsource/lato/900.css";

import App from "./App";
import "./styles/global.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root was not found.");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
