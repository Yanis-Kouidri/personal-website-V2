import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
							// Regex pour extraire le contenu des balises <script>
							const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
							let match;

							while ((match = scriptRegex.exec(html)) !== null) {
								const scriptContent = match[1].trim();
								// On ignore les scripts externes (ceux qui ont un src="..." et pas de code inline)
								if (scriptContent) {
									// Calcul du hash SHA-256 requis par la CSP
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

				// Lancement du scan du dossier de build
				walkDir(distDir);

				// On convertit le Set de hashes en une chaîne de caractères séparée par des espaces
				const hashList = Array.from(hashes).join(" ");

				// Construction de la directive CSP avec tes paramètres exacts
				// Les hashes sont injectés dynamiquement juste après 'self' dans script-src
				const caddyContent = `header Content-Security-Policy "default-src 'none'; img-src 'self' data:; style-src 'self'; script-src 'self' ${hashList}; upgrade-insecure-requests; frame-ancestors 'none'; form-action 'none'; frame-src 'none'; media-src 'none'; connect-src 'none'; font-src 'self'"\n`;

				// Écriture du fichier pour Caddy à la racine de ton projet Astro
				const outputPath = path.join(process.cwd(), "csp_header.caddy");
				fs.writeFileSync(outputPath, caddyContent);

				console.log(
					`\n[CSP] ${hashes.size} hashes JS injectés avec succès dans csp_header.caddy !`,
				);
			},
		},
	};
}
