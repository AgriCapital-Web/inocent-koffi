import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";

// Plugin to copy index.html as 404.html for SPA fallback on static hosts
function spaFallbackPlugin(): Plugin {
  return {
    name: "spa-fallback",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexPath = path.join(distDir, "index.html");
      const fallback404Path = path.join(distDir, "404.html");
      const fallback200Path = path.join(distDir, "200.html");
      
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, fallback404Path);
        fs.copyFileSync(indexPath, fallback200Path);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    spaFallbackPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
