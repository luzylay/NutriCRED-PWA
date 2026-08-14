import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./app/App.tsx";
import { ErrorBoundary } from "./app/components/shared/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./styles/index.css";

// Register PWA Service Worker ONLY in production to prevent dev caching issues
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}pwa-sw.js`)
      .then((reg) =>
        console.log("[Service Worker] Registrado con éxito:", reg.scope),
      )
      .catch((err) => console.error("[Service Worker] Registro fallido:", err));
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </ErrorBoundary>,
);
