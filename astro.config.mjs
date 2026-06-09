// @ts-check

import { shield } from "@kindspells/astro-shield";
import { defineConfig } from "astro/config";
import astroCspHash from "./astro-csp-hash.js";

// https://astro.build/config
export default defineConfig({
	integrations: [astroCspHash(), shield({})],
});
