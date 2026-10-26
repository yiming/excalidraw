import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import "../excalidraw-app/sentry";

import ExcalidrawApp from "./App";

window.__EXCALIDRAW_SHA__ = import.meta.env.VITE_APP_GIT_SHA;
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
// Register during startup. The worker reloads open windows when an update
// activates; see public/sw-navigate-clients.js. Prompt mode is intentional:
// there is no update banner, and this call must not reload on its own.
registerSW({ immediate: true });
root.render(
  <StrictMode>
    <ExcalidrawApp />
  </StrictMode>,
);
