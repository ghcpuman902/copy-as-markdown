import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts", "!src/images/**"],
  outDir: "dist",
  format: ["esm"],
  target: 'esnext',
  splitting: false,
  sourcemap: true,
  clean: true,
  bundle: true,
  noExternal: ["prosemirror-model", "prosemirror-schema-basic", "prosemirror-schema-list", "prosemirror-markdown", "prosemirror-tables"],
  esbuildOptions(options) {
    options.loader = { 
      ".json": "copy",
      ".png": "copy"
    };
  }
});