import fs from "node:fs";
import test, { describe } from "node:test";
import assert from "node:assert";
import { Font } from "../../lib-font.js";

async function loadFontFromPath(path, name = "Untitled Font") {
  path = `./fonts/${path}`;
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

describe(`cmap unit test`, async () => {
  test(`Inter Regular`, async () => {
    const font = await loadFontFromPath("Inter-Regular.otf", "Inter Regular");

    const { cmap } = font.opentype.tables;

    assert(cmap.getGlyphId(65) === 2); // 0x0041
    assert(cmap.getGlyphId(61153) === 2932); // 0xeee1
    assert(cmap.getGlyphId(129106) === 1807); // 0x1f852
    assert(cmap.getGlyphId(61087) === 2913); // 0xee9f
  });

  test(`Source Code Pro`, async () => {
    const font = await loadFontFromPath(
      "SourceCodePro/SourceCodePro-Regular.ttf",
      "Source Code Pro"
    );

    const { cmap } = font.opentype.tables;

    assert(cmap.getGlyphId(65) === 2);
    assert(cmap.getGlyphId(0x1f3b6) === 1560);
    assert(cmap.getGlyphId(0x2500) === 1395);
    assert(cmap.getGlyphId(0xfb02) === 1577);
  });

  test(`Recursive`, async () => {
    const font = await loadFontFromPath("Recursive_VF_1.064.ttf", "Recursive");

    const { cmap } = font.opentype.tables;

    assert(cmap.getGlyphId(65) === 7);
    assert(cmap.getGlyphId(0x00ad) === 716);
    assert(cmap.getGlyphId(0x25bc) === 704);
    assert(cmap.getGlyphId(0x00b5) === 1100);
  });
});
