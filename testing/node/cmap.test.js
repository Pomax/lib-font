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

  const font2 = await loadFontFromPath(
    path.join(__dirname, "../../fonts/SourceCodePro/SourceCodePro-Regular.ttf"),
    "Source Code Pro"
  );
  assert(font2.opentype.tables.cmap.getGlyphId(65) === 2);
  assert(font2.opentype.tables.cmap.getGlyphId(0x1f3b6) === 1560);
  assert(font2.opentype.tables.cmap.getGlyphId(0x2500) === 1395);
  assert(font2.opentype.tables.cmap.getGlyphId(0xfb02) === 1577);

  const font3 = await loadFontFromPath(
    path.join(__dirname, "../../fonts/Recursive_VF_1.064.ttf"),
    "Recursive"
  );
  assert(font3.opentype.tables.cmap.getGlyphId(65) === 7);
  assert(font3.opentype.tables.cmap.getGlyphId(0x00ad) === 716);
  assert(font3.opentype.tables.cmap.getGlyphId(0x25bc) === 704);
  assert(font3.opentype.tables.cmap.getGlyphId(0x00b5) === 1100);
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
