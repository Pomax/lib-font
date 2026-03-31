import fs from "node:fs";
import { describe, test, before } from "node:test";
import assert from "node:assert";
import { Font } from "../../lib-font.js";

const font = new Font("ibm plex sans thai");

describe("IBM Plex Sans Thai", () => {
  before(() => new Promise((resolve, reject) => {
    font.onerror = (err) => reject(err);
    font.onload = () => resolve();
    const buffer = fs.readFileSync("./fonts/IBMPlexSansThai-Light.ttf");
    font.fromDataBuffer(Uint8Array.from(buffer).buffer, "IBMPlexSansThai-Light.ttf");
  }));

  test("font loaded", () => {
    assert.ok(font.opentype !== undefined);
  });

  test("name table ID 9 contains expected designer string", () => {
    const { name } = font.opentype.tables;
    assert.strictEqual(
      name.get(9),
      "Mike Abbink, Paul van der Laan, Pieter van Rosmalen, Ben Mitchell, Mark Frömberg"
    );
  });
});
