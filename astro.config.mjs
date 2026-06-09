// @ts-check

import { defineConfig } from "astro/config";
import astroCspHash from "./astro-csp-hash.js"; // Import de notre script

// https://astro.build/config
export default defineConfig({
	integrations: [
		astroCspHash(), // Ajout de l'intégration ici
	],
});
