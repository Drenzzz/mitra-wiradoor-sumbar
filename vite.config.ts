import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vinext({ react: { compiler: true } })],
  // @base-ui/react is consumed by RSC proxy modules; excluding it avoids the
  // "inconsistently optimized" dev warning.
  optimizeDeps: { exclude: ["@base-ui/react"] },
});
