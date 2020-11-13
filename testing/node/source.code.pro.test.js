import { Font } from "../../../Font.js";
import { testGSUB } from "./gsub/test-gsub.js";

const font = new Font("source code pro");
let letterFor = function(){};

describe("Basic font testing", () => {
  beforeAll((done) => {
    font.onerror = (err) => {
      throw err;
    };
    font.onload = async () => done();
    font.src = "./fonts/SourceCodePro/SourceCodePro-Regular.ttf";
  });

  test("font loaded", () => {
    expect(font.opentype).toBeDefined();

    letterFor = function(glyphid) {
      let reversed = font.opentype.tables.cmap.reverse(glyphid);
      return reversed.unicode ?? `[${glyphid}:??]`;
    };
  });

  test("Glyph support", () => {
    expect(font.supports(`f`)).toBe(true);
    expect(font.supports(`i`)).toBe(true);
    expect(font.supports(String.fromCharCode(0xffff))).toBe(false);
  });

  test("HEAD table", () => {
    const head = font.opentype.tables.head;
    expect(head).toBeDefined();

    expect(head.magicNumber).toBe(1594834165);
    expect(head.fontDirectionHint).toBe(2);
    expect(head.unitsPerEm).toBe(1000);
    expect(head.xMin).toBe(-193);
    expect(head.xMax).toBe(793);
    expect(head.yMin).toBe(-454);
    expect(head.yMax).toBe(1060);
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