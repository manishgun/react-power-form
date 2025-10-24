import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm"], // output both module types
  dts: true, // generate type definitions
  sourcemap: false, // useful for debugging
  clean: false,
  minify: false,
  external: ["react", "react-dom"] // don't bundle React
});
