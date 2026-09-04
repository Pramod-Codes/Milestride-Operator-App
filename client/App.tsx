import "./global.css";

import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (import.meta.env.PROD) {
        navigator.serviceWorker.register("./service-worker.js").catch(() => undefined);
      } else {
        navigator.serviceWorker.getRegistrations().then(registrations => registrations.forEach(registration => registration.unregister()));
        window.caches?.keys().then(keys => keys.filter(key => key.startsWith("milestride-hub-")).forEach(key => window.caches.delete(key)));
      }
    }
  }, []);

  return <HashRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </HashRouter>;
};

createRoot(document.getElementById("root")!).render(<App />);
