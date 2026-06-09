import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export default function astroCspHash() {
	return {
		name: "astro-csp-hash",
		hooks: {
			"astro:build:done": async ({ dir }) => {
				const distDir = fileURLToPath(dir);
				const hashes = new Set();

				// Fonction récursive pour parcourir le dossier /dist et trouver les fichiers HTML
				function walkDir(currentPath) {
					const files = fs.readdirSync(currentPath);
					for (const file of files) {
						const fullPath = path.join(currentPath, file);
						const stat = fs.statSync(fullPath);

						if (stat.isDirectory()) {
							walkDir(fullPath);
						} else if (file.endsWith(".html")) {
							const html = fs.readFileSync(fullPath, "utf8");
							// Regex globale pour attraper le contenu des balises <script>
							const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

							// Utilisation de matchAll pour plaire à Biome (évite l'assignation dans le while)
							const matches = html.matchAll(scriptRegex);
							for (const match of matches) {
								const scriptContent = match[1].trim();
								// On ignore les scripts externes vides
								if (scriptContent) {
									const hash = crypto
										.createHash("sha256")
										.update(scriptContent)
										.digest("base64");
									hashes.add(`'sha256-${hash}'`);
								}
							}
						}
					}
				}

				// Lancement du scan
				walkDir(distDir);

				const hashList = Array.from(hashes).join(" ");

				// Construction de la directive avec tes paramètres exacts
				const caddyContent = `header Content-Security-Policy "default-src 'none'; img-src 'self' data:; style-src 'self'; script-src 'self' ${hashList}; upgrade-insecure-requests; frame-ancestors 'none'; form-action 'none'; frame-src 'none'; media-src 'none'; connect-src 'none'; font-src 'self'"\n`;

				const outputPath = path.join(process.cwd(), "csp_header.caddy");
				fs.writeFileSync(outputPath, caddyContent);

				console.log(
					`\n[CSP] ${hashes.size} hashes JS injectés avec succès dans csp_header.caddy !`,
				);
			},
		},
	};
}
