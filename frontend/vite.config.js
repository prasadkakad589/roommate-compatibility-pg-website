import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        bypass: (req) => {
          // Don't proxy local JS/JSX module files — serve them from Vite
          if (req.url && (req.url.endsWith(".js") || req.url.endsWith(".jsx"))) {
            return req.url;
          }
        },
      },
    },
  },
});
