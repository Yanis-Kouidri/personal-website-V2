import { afterEach, describe, expect, it, vi } from "vitest";
import astroCspHash, {
  extractScriptHashes,
  buildCspDirectives,
  collectHashesFromDir,
  DEFAULT_CSP_CONFIG,
} from "./astro-csp-hash.js";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

function sha256(content) {
  return `'sha256-${crypto.createHash("sha256").update(content).digest("base64")}'`;
}

describe("extractScriptHashes", () => {
  it("génère le hash sha256 correct pour un script inline", () => {
    const script = "console.log('hello')";
    const html = `<html><body><script>${script}</script></body></html>`;

    const hashes = extractScriptHashes(html);

    expect(hashes.size).toBe(1);
    expect(hashes.has(sha256(script))).toBe(true);
  });

  it("ignore les balises script vides", () => {
    const html = `<html><body><script></script><script>   </script></body></html>`;
    expect(extractScriptHashes(html).size).toBe(0);
  });

  it("ignore les scripts externes (avec src) sans contenu inline", () => {
    const html = `<html><body><script src="/app.js"></script></body></html>`;
    expect(extractScriptHashes(html).size).toBe(0);
  });

  it("hash un script externe avec src ET contenu inline (cas limite)", () => {
    // Cas réel : un tag <script src="..."> ne devrait jamais avoir de contenu,
    // mais si ça arrive on veut un comportement prévisible.
    const script = "window.x = 1";
    const html = `<html><body><script src="/app.js">${script}</script></body></html>`;
    const hashes = extractScriptHashes(html);
    expect(hashes.has(sha256(script))).toBe(true);
  });

  it("déduplique les scripts identiques", () => {
    const script = "console.log('dup')";
    const html = `<script>${script}</script><script>${script}</script>`;
    expect(extractScriptHashes(html).size).toBe(1);
  });

  it("gère plusieurs scripts différents dans le même HTML", () => {
    const html = `<script>a()</script><script>b()</script>`;
    expect(extractScriptHashes(html).size).toBe(2);
  });

  it("retourne un set vide si aucun script n'est présent", () => {
    const html = `<html><body><p>Rien ici</p></body></html>`;
    expect(extractScriptHashes(html).size).toBe(0);
  });
});

describe("buildCspDirectives", () => {
  it("construit une directive script-src avec les hashes fournis", () => {
    const hashes = new Set(["'sha256-AAA='"]);
    const result = buildCspDirectives(DEFAULT_CSP_CONFIG, hashes);

    expect(result).toContain("script-src 'self' 'sha256-AAA='");
  });

  it("n'ajoute pas d'espace superflu quand il n'y a aucun hash", () => {
    const result = buildCspDirectives(DEFAULT_CSP_CONFIG, new Set());
    expect(result).toContain("script-src 'self'");
    expect(result).not.toMatch(/script-src 'self' $/);
  });

  it("gère les directives booléennes sans valeur (upgrade-insecure-requests)", () => {
    const result = buildCspDirectives(DEFAULT_CSP_CONFIG, new Set());
    const directives = result.split("; ");
    expect(directives).toContain("upgrade-insecure-requests");
  });

  it("respecte une surcharge de configuration personnalisée", () => {
    const custom = { ...DEFAULT_CSP_CONFIG, "img-src": "'self' https:" };
    const result = buildCspDirectives(custom, new Set());
    expect(result).toContain("img-src 'self' https:");
  });

  it("place les hashes uniquement sur script-src, pas sur les autres directives", () => {
    const hashes = new Set(["'sha256-AAA='"]);
    const result = buildCspDirectives(DEFAULT_CSP_CONFIG, hashes);
    expect(result).not.toContain("style-src 'self' 'sha256-AAA='");
  });
});

describe("collectHashesFromDir", () => {
  it("parcourt récursivement un dossier et agrège les hashes de tous les .html", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "csp-test-"));
    const subDir = path.join(tmpDir, "en");
    fs.mkdirSync(subDir);

    fs.writeFileSync(
      path.join(tmpDir, "index.html"),
      `<script>console.log('root')</script>`,
    );
    fs.writeFileSync(
      path.join(subDir, "index.html"),
      `<script>console.log('en')</script>`,
    );
    fs.writeFileSync(path.join(tmpDir, "style.css"), "body{color:red}");

    const hashes = collectHashesFromDir(tmpDir);

    expect(hashes.size).toBe(2);
    expect(hashes.has(sha256("console.log('root')"))).toBe(true);
    expect(hashes.has(sha256("console.log('en')"))).toBe(true);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("ignore les fichiers non-html", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "csp-test-"));
    fs.writeFileSync(path.join(tmpDir, "app.js"), "console.log('js')");

    expect(collectHashesFromDir(tmpDir).size).toBe(0);

    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
});

describe("astroCspHash", () => {
  let tmpDir;

  afterEach(() => {
    vi.restoreAllMocks();
    if (tmpDir) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      tmpDir = undefined;
    }
  });

  it("writes a Caddy header containing hashes discovered after the build", async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "csp-build-test-"));
    const script = "window.analyticsEnabled = true";
    fs.writeFileSync(
      path.join(tmpDir, "index.html"),
      `<script>${script}</script>`,
    );
    const writeFileSync = vi
      .spyOn(fs, "writeFileSync")
      .mockImplementation(() => {});

    const integration = astroCspHash({ "img-src": "'self' https:" });
    await integration.hooks["astro:build:done"]({
      dir: pathToFileURL(`${tmpDir}${path.sep}`),
    });

    expect(writeFileSync).toHaveBeenCalledWith(
      path.join(process.cwd(), "csp_header.caddy"),
      expect.stringContaining(
        `header Content-Security-Policy "default-src 'none'; img-src 'self' https:`,
      ),
    );
    expect(writeFileSync).toHaveBeenCalledWith(
      path.join(process.cwd(), "csp_header.caddy"),
      expect.stringContaining(`script-src 'self' ${sha256(script)}`),
    );
  });
});
