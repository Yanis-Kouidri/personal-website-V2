/**
 * Open Graph image rendering
 * Builds the 1200x630 link preview card of a locale. Satori lays out the card
 * and converts the text to vector paths, so no system font is needed to
 * rasterize it. Served by src/pages/og/[locale].jpg.ts.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

// Same palette as the :root variables in src/styles/global.css
const COLORS = {
  background: "#f2f4f3",
  font: "#070b07",
  primary: "#006e1a",
  secondary: "#8ae68e",
  fontOverSecondary: "#004911",
};

// Files are read from the project root: the endpoint runs during the build
const fromRoot = (file: string) => path.join(process.cwd(), file);

type Node = {
  type: string;
  props: { style?: Record<string, string | number>; [key: string]: unknown };
};
const h = (
  type: string,
  style: Record<string, string | number>,
  children?: unknown,
  props: Record<string, unknown> = {},
): Node => ({ type, props: { style, children, ...props } });

/** Renders the Open Graph card of a locale as a JPEG */
export async function renderOgImage(locale: string): Promise<Buffer> {
  const [home] = await getCollection("home", (e) => e.data.locale === locale);
  const [phd] = await getCollection("phd", (e) => e.data.locale === locale);
  const { title, subtitle, ctaLabel } = home.data;
  const keywords = phd.data.keywords.slice(0, 4);

  const [regular, extraBold, photo] = await Promise.all([
    readFile(fromRoot("src/assets/og/Inter-Regular.ttf")),
    readFile(fromRoot("src/assets/og/Inter-ExtraBold.ttf")),
    sharp(fromRoot("src/assets/Yanis_Kouidri_home.jpg"))
      .resize(840, 840)
      .jpeg({ quality: 85 })
      .toBuffer(),
  ]);

  const card = h(
    "div",
    {
      width: "100%",
      height: "100%",
      // Padding and border must stay inside the 1200x630 canvas
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 90px",
      backgroundColor: COLORS.background,
      borderBottom: `14px solid ${COLORS.primary}`,
      fontFamily: "Inter",
    },
    [
      h("div", { display: "flex", flexDirection: "column", width: 640 }, [
        h(
          "div",
          { fontSize: 80, fontWeight: 800, color: COLORS.font, lineHeight: 1 },
          title,
        ),
        h(
          "div",
          {
            fontSize: 34,
            color: COLORS.font,
            lineHeight: 1.35,
            marginTop: 28,
          },
          subtitle,
        ),
        h(
          "div",
          { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 },
          keywords.map((keyword) =>
            h(
              "div",
              {
                fontSize: 24,
                fontWeight: 800,
                color: COLORS.fontOverSecondary,
                backgroundColor: COLORS.secondary,
                padding: "8px 18px",
                borderRadius: 8,
              },
              keyword,
            ),
          ),
        ),
        // Call to action: the localized hero button label, styled as a button
        h("div", { display: "flex", alignItems: "center", marginTop: 44 }, [
          h(
            "div",
            {
              fontSize: 28,
              fontWeight: 800,
              color: "#ffffff",
              backgroundColor: COLORS.primary,
              padding: "14px 30px",
              borderRadius: 999,
            },
            `${ctaLabel} →`,
          ),
          h(
            "div",
            {
              fontSize: 26,
              fontWeight: 800,
              color: COLORS.primary,
              marginLeft: 24,
            },
            "www.kouidri.fr",
          ),
        ]),
      ]),
      h("img", { width: 380, height: 380, borderRadius: "50%" }, undefined, {
        src: `data:image/jpeg;base64,${photo.toString("base64")}`,
        width: 380,
        height: 380,
      }),
    ],
  );

  const svg = await satori(card as Parameters<typeof satori>[0], {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fonts: [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: extraBold, weight: 800, style: "normal" },
    ],
  });
  return sharp(Buffer.from(svg))
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}
