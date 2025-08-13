import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DarkRadialLayout } from "./components/Applayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DarkRadialLayout>
      <App />
    </DarkRadialLayout>
  </StrictMode>
);
