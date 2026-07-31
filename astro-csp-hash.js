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

export const DEFAULT_CSP_CONFIG = {
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

/**
 * Extracts inline <script> contents from an HTML string and returns
 * their SHA-256 hashes formatted for a CSP script-src directive.
 * @param {string} html
 * @returns {Set<string>}
 */
export function extractScriptHashes(html) {
  const hashes = new Set();
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script\b[^>]*>/gi;

  for (const match of html.matchAll(scriptRegex)) {
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

  return hashes;
}

/**
 * Recursively walks a directory and returns the hashes found across
 * every .html file.
 * @param {string} rootDir
 * @returns {Set<string>}
 */
export function collectHashesFromDir(rootDir) {
  const hashes = new Set();

  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (file.endsWith(".html")) {
        const html = fs.readFileSync(fullPath, "utf8");
        for (const hash of extractScriptHashes(html)) {
          hashes.add(hash);
        }
      }
    }
  }

  walkDir(rootDir);
  return hashes;
}

/**
 * Builds the full CSP directive string from a config object and a set
 * of script hashes.
 * @param {Record<string,string>} cspConfig
 * @param {Set<string>} hashes
 * @returns {string}
 */
export function buildCspDirectives(cspConfig, hashes) {
  const hashList = Array.from(hashes).join(" ");

  return Object.entries(cspConfig)
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
}

export default function astroCspHash(options = {}) {
  const cspConfig = { ...DEFAULT_CSP_CONFIG, ...options };

  return {
    name: "astro-csp-hash",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const hashes = collectHashesFromDir(distDir);
        const cspDirectives = buildCspDirectives(cspConfig, hashes);
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
