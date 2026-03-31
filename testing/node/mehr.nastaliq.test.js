import fs from "node:fs";
import { describe, test, before } from "node:test";
import assert from "node:assert";
import { Font } from "../../lib-font.js";
import { testGSUB } from "./gsub/test-gsub.js";

const font = new Font("mehr nastaliq");

describe("Basic font testing", () => {
  before(() => new Promise((resolve, reject) => {
    font.onerror = (err) => reject(err);
    font.onload = () => resolve();
    const buffer = fs.readFileSync("./fonts/MehrNastaliqWeb-Regular.ttf");
    font.fromDataBuffer(Uint8Array.from(buffer).buffer, "MehrNastaliqWeb-Regular.ttf");
  }));

  test("font loaded", () => {
    assert.ok(font.opentype !== undefined);
  });

  test("GSUB format 6/8 functionality", () => {
    testGSUB(font, {
      script: [],
      feature: [],
      lookup: [
        type6LookupTest,
        type8LookupTest,
      ]
    })
  });
});

function type6LookupTest(font, script, langsys, feature, lookupId, lookup) {
  if (lookup.lookupType !== 6) return;
  // console.log(script, langsys, feature, lookupId);
}

function type8LookupTest(font, script, langsys, feature, lookupId, lookup) {
  if (lookup.lookupType !== 8) return;
  // console.log(script, langsys, feature, lookupId);
}
