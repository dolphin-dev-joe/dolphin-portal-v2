import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const src = fileURLToPath(new URL("./src", import.meta.url));

// Keep in sync with "paths" in tsconfig.json.
const ALIAS_DIRS = [
  "components",
  "config",
  "constants",
  "contexts",
  "features",
  "hooks",
  "interfaces",
  "lib",
  "pages",
  "providers",
  "routes",
  "styles",
  "utils",
];

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${src}/` },
      ...ALIAS_DIRS.map((dir) => ({
        find: new RegExp(`^@${dir}(?=/|$)`),
        replacement: `${src}/${dir}`,
      })),
    ],
  },
  server: {
    port: 5173,
  },
});
