import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vitePrerenderPlugin } from "vite-prerender-plugin";
import { fileURLToPath } from "node:url";
import { certificateMetadata } from "./certificate-metadata";
import { certificate } from "./src/certificate-config";

export default defineConfig({
  // Относительная база работает и на GitHub Pages /vershina43/, и на собственном домене.
  base: "./",
  plugins: [
    react(),
    vitePrerenderPlugin({
      renderTarget: "#root",
      additionalPrerenderRoutes: [certificate.path],
      prerenderScript: fileURLToPath(new URL("./src/prerender.tsx", import.meta.url)),
    }),
    certificateMetadata(),
  ],
});
