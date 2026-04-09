import fs from "node:fs";
import { describe, test, before } from "node:test";
import assert from "node:assert";
import { Font } from "../../lib-font.js";
import { testGSUB } from "./gsub/test-gsub.js";

const font = new Font("source code pro");
let letterFor = function(){};

describe("Basic font testing", () => {
  before(() => new Promise((resolve, reject) => {
    font.onerror = (err) => reject(err);
    font.onload = () => resolve();
    const buffer = fs.readFileSync("./fonts/SourceCodePro/SourceCodePro-Regular.ttf");
    font.fromDataBuffer(Uint8Array.from(buffer).buffer, "SourceCodePro-Regular.ttf");
  }));

  test("font loaded", () => {
    assert.ok(font.opentype !== undefined);

    letterFor = function(glyphid) {
      let reversed = font.opentype.tables.cmap.reverse(glyphid);
      return reversed.unicode ?? `[${glyphid}:??]`;
    };
  });

  test("Glyph support", () => {
    assert.strictEqual(font.supports(`f`), true);
    assert.strictEqual(font.supports(`i`), true);
    assert.strictEqual(font.supports(String.fromCharCode(0xffff)), false);
  });

  test("HEAD table", () => {
    const head = font.opentype.tables.head;
    assert.ok(head !== undefined);

    assert.strictEqual(head.magicNumber, 1594834165);
    assert.strictEqual(head.fontDirectionHint, 2);
    assert.strictEqual(head.unitsPerEm, 1000);
    assert.strictEqual(head.xMin, -193);
    assert.strictEqual(head.xMax, 793);
    assert.strictEqual(head.yMin, -454);
    assert.strictEqual(head.yMax, 1060);
  });

  test("GSUB table", () => {
    testGSUB(font, {
      script: [],
      feature: [],
      lookup: [
        oneForOneSubstitution,
        ligatureSubstitutions,
      ]
    });
  });
});


function oneForOneSubstitution(font, script, lang, feature, lookupId, lookup) {
  if (lookup.lookupType !== 1) return;

  lookup.subtableOffsets.forEach((_, i) => {
    const subtable = lookup.getSubTable(i);
    const coverage = subtable.getCoverageTable();
    let glyphs = coverage.glyphArray;
    if (!glyphs) {
      glyphs = coverage.rangeRecords.map(
        (r) => `${r.startGlyphID}-${r.endGlyphID}`
      );
    }
  });
}


function ligatureSubstitutions(font, script, lang, feature, lookupId, lookup) {
  if (lookup.lookupType !== 4) return;

  lookup.subtableOffsets.forEach((_, i) => {
    const subtable = lookup.getSubTable(i);
    const coverage = subtable.getCoverageTable();

    subtable.ligatureSetOffsets.forEach((_, setIndex) => {
      const ligatureSet = subtable.getLigatureSet(setIndex);

      ligatureSet.ligatureOffsets.forEach((_, ligIndex) => {
        const ligatureTable = ligatureSet.getLigature(ligIndex);

        const sequence = [
          coverage.glyphArray[setIndex],
          ...ligatureTable.componentGlyphIDs,
        ];

        // console.log(
        //   `ligature set [${setIndex}], ligature table [${ligIndex}]: ${script}[${lang}].${feature.featureTag}[${id}]: ligature (coverage:${coverage.coverageFormat}) [ ${
        //     sequence.map(letterFor).join(` + `)
        //   } ] -> ${
        //     letterFor(ligatureTable.ligatureGlyph)
        //   }`
        // );
      });
    });
  });
}