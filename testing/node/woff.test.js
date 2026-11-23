import fs from "node:fs";
import { describe, test, before } from "node:test";
import assert from "node:assert";
import { Font } from "../../lib-font.js";

const font = new Font("source code pro woff");

describe("WOFF font testing", () => {
  before(() => new Promise((resolve, reject) => {
    font.onerror = (err) => reject(err);
    font.onload = () => resolve();
    const buffer = fs.readFileSync("./fonts/SourceCodePro/SourceCodePro-Regular.ttf.woff");
    font.fromDataBuffer(Uint8Array.from(buffer).buffer, "SourceCodePro-Regular.ttf.woff").catch(reject);
  }));

  test("font loaded", () => {
    assert.ok(font.opentype !== undefined);
    assert.strictEqual(font.opentype.tables.head.unitsPerEm, 1000);
  });
});
