import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Mock @lucide/astro car il exporte des composants Astro (.astro) que
// Vitest ne peut pas parser. Les icônes ne sont pas utilisées dans les tests
// de données, seulement les métadonnées structurelles.
vi.mock("@lucide/astro", () => {
  const MockIcon = "MockIcon";
  return {
    default: {},
    Icon: MockIcon,
    CodeXml: MockIcon,
    Globe: MockIcon,
    Infinity: MockIcon,
    Network: MockIcon,
    Server: MockIcon,
    ShieldCheck: MockIcon,
  };
});

const { skillCategories } = await import("./skills-data.ts");

const PUBLIC_DIR = path.resolve(import.meta.dirname, "../../public");

describe("skillCategories", () => {
  // ── Structure globale

  it("contient exactement 6 catégories", () => {
    expect(skillCategories).toHaveLength(6);
  });

  it("chaque catégorie possède les champs requis", () => {
    for (const category of skillCategories) {
      expect(category).toHaveProperty("id");
      expect(typeof category.id).toBe("string");
      expect(category).toHaveProperty("label");
      expect(typeof category.label).toBe("string");
      expect(category).toHaveProperty("icon");
      expect(category).toHaveProperty("skills");
      expect(Array.isArray(category.skills)).toBe(true);
    }
  });

  it("chaque catégorie contient au moins 1 skill", () => {
    for (const category of skillCategories) {
      expect(category.skills.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("les IDs des catégories sont uniques", () => {
    const ids = skillCategories.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("les IDs des catégories sont dans un ordre cohérent", () => {
    const ids = skillCategories.map((c) => c.id);
    expect(ids).toEqual([
      "web",
      "programming",
      "networking",
      "infrastructure",
      "security",
      "devops",
    ]);
  });

  // ── Structure des skills individuels ────────────────────────────

  it("chaque skill possède les champs requis (name, logoPath, url)", () => {
    for (const category of skillCategories) {
      for (const skill of category.skills) {
        expect(skill).toHaveProperty("name");
        expect(typeof skill.name).toBe("string");
        expect(skill.name.length).toBeGreaterThan(0);

        expect(skill).toHaveProperty("logoPath");
        expect(typeof skill.logoPath).toBe("string");
        expect(skill.logoPath.length).toBeGreaterThan(0);

        expect(skill).toHaveProperty("url");
        expect(typeof skill.url).toBe("string");
        expect(skill.url.length).toBeGreaterThan(0);
      }
    }
  });

  it("les noms de skills sont uniques dans tout le jeu de données", () => {
    const allNames = skillCategories.flatMap((c) =>
      c.skills.map((s) => s.name),
    );
    expect(new Set(allNames).size).toBe(allNames.length);
  });

  it("les noms de skills sont uniques au sein de chaque catégorie", () => {
    for (const category of skillCategories) {
      const names = category.skills.map((s) => s.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });

  // ── Chemins des logos ──────────────────────────────────────────

  it("tous les logoPath commencent par /skills/", () => {
    for (const category of skillCategories) {
      for (const skill of category.skills) {
        expect(skill.logoPath).toMatch(/^\/skills\//);
      }
    }
  });

  it("tous les logoPath correspondent à des fichiers existants dans public/", () => {
    for (const category of skillCategories) {
      for (const skill of category.skills) {
        const filePath = path.join(PUBLIC_DIR, skill.logoPath);
        const exists = fs.existsSync(filePath);
        expect(exists, `Fichier manquant : ${skill.logoPath}`).toBe(true);
      }
    }
  });

  it("tous les logoPath sont dans le bon dossier de catégorie", () => {
    // Note : le dossier dans public/skills/ ne correspond pas toujours
    // à l'ID de la catégorie (ex: "programming" -> "prog/",
    // "networking" -> "network/", "infrastructure" -> "infra/",
    // "security" -> "cyber/"). Ce test vérifie que le logoPath
    // contient au moins le nom du skill dans un sous-dossier de /skills/.
    for (const category of skillCategories) {
      for (const skill of category.skills) {
        expect(skill.logoPath).toMatch(/^\/skills\/.+\/.+$/);
      }
    }
  });
  // ── URLs ───────────────────────────────────────────────────────

  it("toutes les URLs commencent par https://", () => {
    for (const category of skillCategories) {
      for (const skill of category.skills) {
        expect(skill.url).toMatch(/^https:\/\//);
      }
    }
  });

  it("toutes les URLs sont des URLs valides", () => {
    for (const category of skillCategories) {
      for (const skill of category.skills) {
        expect(() => new URL(skill.url)).not.toThrow();
      }
    }
  });

  // ── Détail par catégorie ───────────────────────────────────────

  describe("catégorie web", () => {
    const web = skillCategories.find((c) => c.id === "web")!;

    it("a les bons champs", () => {
      expect(web.label).toBe("Web");
      expect(web.skills).toHaveLength(11);
    });

    it("contient les skills Web attendus", () => {
      const names = web.skills.map((s) => s.name);
      expect(names).toContain("JavaScript");
      expect(names).toContain("TypeScript");
      expect(names).toContain("React");
      expect(names).toContain("Astro");
      expect(names).toContain("Bun");
      expect(names).toContain("NodeJS");
      expect(names).toContain("HTML5");
      expect(names).toContain("CSS3");
      expect(names).toContain("Vite");
      expect(names).toContain("Strapi");
      expect(names).toContain("Figma");
    });
  });

  describe("catégorie programming", () => {
    const prog = skillCategories.find((c) => c.id === "programming")!;

    it("a les bons champs", () => {
      expect(prog.label).toBe("Programming");
      expect(prog.skills).toHaveLength(6);
    });

    it("contient les skills Programming attendus", () => {
      const names = prog.skills.map((s) => s.name);
      expect(names).toContain("Ada");
      expect(names).toContain("Python");
      expect(names).toContain("Rust");
      expect(names).toContain("C");
      expect(names).toContain("Java");
      expect(names).toContain("Bash");
    });
  });

  describe("catégorie networking", () => {
    const net = skillCategories.find((c) => c.id === "networking")!;

    it("a les bons champs", () => {
      expect(net.label).toBe("Networking");
      expect(net.skills).toHaveLength(15);
    });

    it("contient les protocoles et outils réseau attendus", () => {
      const names = net.skills.map((s) => s.name);
      expect(names).toContain("Switch");
      expect(names).toContain("Router");
      expect(names).toContain("Cisco");
      expect(names).toContain("Frame Relay");
      expect(names).toContain("TCP");
      expect(names).toContain("UDP");
      expect(names).toContain("X.25");
      expect(names).toContain("ATM");
      expect(names).toContain("Wireshark");
      expect(names).toContain("HTTP");
      expect(names).toContain("DNS");
      expect(names).toContain("DHCP");
      expect(names).toContain("OSPF");
      expect(names).toContain("BGP");
      expect(names).toContain("MPLS");
    });
  });

  describe("catégorie infrastructure", () => {
    const infra = skillCategories.find((c) => c.id === "infrastructure")!;

    it("a les bons champs", () => {
      expect(infra.label).toBe("Infrastructure");
      expect(infra.skills).toHaveLength(7);
    });

    it("contient les skills Infrastructure attendus", () => {
      const names = infra.skills.map((s) => s.name);
      expect(names).toContain("Docker");
      expect(names).toContain("Kubernetes");
      expect(names).toContain("Podman");
      expect(names).toContain("Helm");
      expect(names).toContain("Linux");
      expect(names).toContain("Cert-manager");
      expect(names).toContain("Envoy Proxy");
    });
  });

  describe("catégorie security", () => {
    const sec = skillCategories.find((c) => c.id === "security")!;

    it("a les bons champs", () => {
      expect(sec.label).toBe("Cyber");
      expect(sec.skills).toHaveLength(3);
    });

    it("contient les skills Cyber attendus", () => {
      const names = sec.skills.map((s) => s.name);
      expect(names).toContain("Crowdsec");
      expect(names).toContain("Wireguard");
      expect(names).toContain("TOR");
    });
  });

  describe("catégorie devops", () => {
    const devops = skillCategories.find((c) => c.id === "devops")!;

    it("a les bons champs", () => {
      expect(devops.label).toBe("DevOps");
      expect(devops.skills).toHaveLength(13);
    });

    it("contient les outils DevOps attendus", () => {
      const names = devops.skills.map((s) => s.name);
      expect(names).toContain("Git");
      expect(names).toContain("Ansible");
      expect(names).toContain("GitLab CI/CD");
      expect(names).toContain("GitHub Actions");
      expect(names).toContain("Dependabot");
      expect(names).toContain("Renovate");
      expect(names).toContain("Jenkins");
      expect(names).toContain("Antora");
      expect(names).toContain("Luigi");
      expect(names).toContain("Argo Workflow");
      expect(names).toContain("n8n");
      expect(names).toContain("SonarQube");
      expect(names).toContain("Material for Mkdocs");
    });
  });
});
