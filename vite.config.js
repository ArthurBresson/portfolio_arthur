import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import staticContent from "./seo/staticContent.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    staticContent(),
  ],
});
