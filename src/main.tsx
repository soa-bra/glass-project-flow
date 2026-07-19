import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './features/planning/elements/smart/root-connector.css'
import { Telemetry } from './infra/telemetry'
import { registerServiceWorker } from './pwa/registerSW'

Telemetry.init();
void registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
