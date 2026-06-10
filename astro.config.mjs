// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import remarkResolveContentImages from "./src/remark-resolve-content-images.js";

// https://astro.build/config
export default defineConfig({
  site: 'https://chancecorp.ru',
  base: '',
  trailingSlash: 'never',
  integrations: [react()],
  markdown: {
    remarkPlugins: [remarkResolveContentImages],
  },
});
