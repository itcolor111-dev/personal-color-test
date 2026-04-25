import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/personal-color-test/",
  build: {
    outDir: "docs",
  },
});