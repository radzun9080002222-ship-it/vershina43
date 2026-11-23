import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import CertificatePage from "./CertificatePage";
import "./index.css";

const root = document.getElementById("root")!;
const Page = /\/sertifikat\/(?:index\.html)?$/.test(location.pathname) ? CertificatePage : App;

// Если HTML уже отрисован пререндером — гидрируем, иначе обычный рендер (dev-режим).
if (root.hasChildNodes()) {
  hydrateRoot(
    root,
    <React.StrictMode>
      <Page />
    </React.StrictMode>
  );
} else {
  createRoot(root).render(
    <React.StrictMode>
      <Page />
    </React.StrictMode>
  );
}
