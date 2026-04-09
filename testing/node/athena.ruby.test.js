import fs from "node:fs";
import { describe, test, before } from "node:test";
import assert from "node:assert";
import { Font } from "../../lib-font.js";
import { testGSUB } from "./gsub/test-gsub.js";

const font = new Font("athena ruby");

describe("Basic font testing", () => {
  before(() => new Promise((resolve, reject) => {
    font.onerror = (err) => reject(err);
    font.onload = () => resolve();
    const buffer = fs.readFileSync("./fonts/AthenaRuby_b018.ttf");
    font.fromDataBuffer(Uint8Array.from(buffer).buffer, "AthenaRuby_b018.ttf");
  }));

  test("font loaded", () => {
    assert.ok(font.opentype !== undefined);
  });

  test("GSUB format 3 variant access", () => {
    testGSUB(font, {
      script: [],
      feature: [],
      lookup: [lookup3Alternates]
    })
  });
});


function lookup3Alternates(font, script, lang, feature, lookupId, lookup) {
  if (lookup.lookupType !== 3) return;
  if (lookupId !== 15) return;

  // console.log(lookup);

  const subtable = lookup.getSubTable(0);
  const coverage = subtable.getCoverageTable(0);
  const altset = subtable.getAlternateSet(0);

  // console.log(subtable, coverage, altset);

  const getGlyphName = id => font.opentype.tables.post.getGlyphName(id);
  // console.log(getGlyphName(coverage.glyphArray[0]), `⇒`, altset.alternateGlyphIDs.map(getGlyphName));

  // test here
}
