import fs from "node:fs";
import { describe, test, before } from "node:test";
import assert from "node:assert";
import { Font } from "../../../lib-font.js";

const font = new Font("flaticon");

describe("Basic font testing", () => {
  before(() => new Promise((resolve, reject) => {
    font.onerror = (err) => reject(err);
    font.onload = () => resolve();
    const buffer = fs.readFileSync("./fonts/issue-114/Flaticon.woff2");
    font.fromDataBuffer(Uint8Array.from(buffer).buffer, "Flaticon.woff2");
  }));

  test("font loaded", () => {
    assert.ok(font.opentype !== undefined);
  });

  test("has name table", () => {
    const { name } = font.opentype.tables;

    assert.ok(name !== undefined);
    assert.strictEqual(name.count, 14);

    const ID3 = `FontForge 2.0 : Flaticon : 21-12-2019`;
    assert.strictEqual(name.get(3), ID3);
  });
});

