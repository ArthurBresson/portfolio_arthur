import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  build: {
    // three.js (ThreeNetwork) est chargé en lazy et seulement sur desktop :
    // son chunk dépasse 500 kB sans impacter le premier affichage.
    chunkSizeWarningLimit: 1000,
  },
});
