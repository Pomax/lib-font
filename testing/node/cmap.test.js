import { Font } from "../../lib-font.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import assert from "assert";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const font = await loadFontFromPath(
    path.join(__dirname, "../../fonts/Inter-Regular.otf"),
    "Inter Regular"
  );

  assert(font.opentype.tables.cmap.getGlyphId(65) === 2); // 0x0041
  assert(font.opentype.tables.cmap.getGlyphId(61153) === 2932); // 0xeee1
  assert(font.opentype.tables.cmap.getGlyphId(129106) === 1807); // 0x1f852
  assert(font.opentype.tables.cmap.getGlyphId(61087) === 2913); // 0xee9f
}

async function loadFontFromPath(path, name = "Untitled Font") {
  return new Promise(async (resolve, reject) => {
    const font = new Font(name);
    const fontBuffer = await fs.promises.readFile(path);
    font.fromDataBuffer(Uint8Array.from(fontBuffer).buffer, path);
    font.onload = () => {
      resolve(font);
    };
    font.onerror = (err) => {
      reject(err);
    };
  });
}

main();
