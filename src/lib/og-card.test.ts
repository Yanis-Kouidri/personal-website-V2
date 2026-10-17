import { beforeAll, describe, expect, it } from "vitest";
import sharp from "sharp";
import {
  COLORS,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  renderOgCard,
} from "./og-card";

/**
 * Layout regression test for the Open Graph card: checks where things land
 * in the rendered pixels, so a layout engine change (e.g. the satori 0.57
 * box-sizing change that pushed the photo off the canvas) fails CI.
 */

type Rgb = [number, number, number];
const hexToRgb = (hex: string): Rgb =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;
// JPEG compression shifts colors slightly
const isClose = (a: Rgb, b: Rgb, tolerance = 24) =>
  a.every((value, i) => Math.abs(value - b[i]) <= tolerance);

let pixels: Buffer;
let info: { width: number; height: number; channels: number };
const pixelAt = (x: number, y: number): Rgb => {
  const offset = (y * info.width + x) * info.channels;
  return [pixels[offset], pixels[offset + 1], pixels[offset + 2]];
};

describe("renderOgCard", () => {
  beforeAll(async () => {
    const jpeg = await renderOgCard({
      title: "Yanis Kouidri",
      subtitle: "Doctorant en première année de thèse CIFRE",
      keywords: ["WSN", "UAV", "Edge computing", "Routage opportuniste"],
      ctaLabel: "En savoir plus",
    });
    ({ data: pixels, info } = await sharp(jpeg)
      .raw()
      .toBuffer({ resolveWithObject: true }));
  }, 30_000);

  it("produit une image 1200x630", () => {
    expect([info.width, info.height]).toEqual([
      OG_IMAGE_WIDTH,
      OG_IMAGE_HEIGHT,
    ]);
  });

  it("garde la bande verte en bas de l'image", () => {
    const primary = hexToRgb(COLORS.primary);
    for (const x of [10, 600, 1190]) {
      expect(pixelAt(x, OG_IMAGE_HEIGHT - 5), `x=${x}`).toSatisfy((p: Rgb) =>
        isClose(p, primary),
      );
    }
  });

  it("garde la photo dans le cadre, avec la marge de droite", () => {
    const background = hexToRgb(COLORS.background);
    // Right margin (90px padding) stays empty
    for (const y of [200, 315, 430]) {
      expect(pixelAt(OG_IMAGE_WIDTH - 40, y), `y=${y}`).toSatisfy((p: Rgb) =>
        isClose(p, background),
      );
    }
    // The 380px round photo is centered vertically against the padding
    const photoCenter = pixelAt(OG_IMAGE_WIDTH - 90 - 190, 315);
    expect(isClose(photoCenter, background)).toBe(false);
  });

  it("affiche le titre en haut à gauche", () => {
    const font = hexToRgb(COLORS.font);
    let darkPixels = 0;
    for (let x = 90; x < 500; x += 2) {
      for (let y = 100; y < 220; y += 2) {
        if (isClose(pixelAt(x, y), font, 60)) darkPixels++;
      }
    }
    expect(darkPixels).toBeGreaterThan(500);
  });
});
