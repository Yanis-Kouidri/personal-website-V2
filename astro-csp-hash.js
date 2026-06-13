/**
 * @file astro-csp-hash.js
 * @description Astro integration that automatically scans generated HTML files post-build,
 * extracts inline JavaScript code, and generates corresponding SHA-256 hashes.
 * It compiles these hashes into a dynamic Content Security Policy (CSP) header
 * and outputs a ready-to-use configuration file for the Caddy web server.
 * * @outputs {File} csp_header.caddy - Contains the formatted Caddy header directive with updated CSP rules.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_CSP_CONFIG = {
  "default-src": "'none'",
  "img-src": "'self' data:",
  "style-src": "'self'",
  "script-src": "'self'",
  "upgrade-insecure-requests": "",
  "frame-ancestors": "'none'",
  "form-action": "'none'",
  "frame-src": "'none'",
  "media-src": "'none'",
  "connect-src": "'none'",
  "font-src": "'self'",
  "base-uri": "'none'",
};

export default function astroCspHash(options = {}) {
  const cspConfig = { ...DEFAULT_CSP_CONFIG, ...options };

  return {
    name: "astro-csp-hash",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const hashes = new Set();

        // Recursively traverses the build directory to find and process HTML files
        function walkDir(currentPath) {
          const files = fs.readdirSync(currentPath);
          for (const file of files) {
            const fullPath = path.join(currentPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
              walkDir(fullPath);
            } else if (file.endsWith(".html")) {
              const html = fs.readFileSync(fullPath, "utf8");
              const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;

              // Match inline scripts and generate SHA-256 hashes
              const matches = html.matchAll(scriptRegex);
              for (const match of matches) {
                const scriptContent = match[1].trim();

                // Skip external or empty script tags
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

        walkDir(distDir);

        const hashList = Array.from(hashes).join(" ");

        // Dynamically build the CSP string from the configuration object
        const cspDirectives = Object.entries(cspConfig)
          .map(([directive, value]) => {
            // Append generated hashes specifically to the script-src directive
            if (directive === "script-src" && hashList) {
              return `${directive} ${value} ${hashList}`;
            }
            // Handle boolean directives that don't require a value (e.g., upgrade-insecure-requests)
            if (!value) {
              return directive;
            }
            return `${directive} ${value}`;
          })
          .join("; ");

        const caddyContent = `header Content-Security-Policy "${cspDirectives}"\n`;

        const outputPath = path.join(process.cwd(), "csp_header.caddy");
        fs.writeFileSync(outputPath, caddyContent);

        console.log(
          `\n[CSP] ${hashes.size} hashes JS injectés avec succès dans csp_header.caddy !`,
        );
      },
    },
  };
}
