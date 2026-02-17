import { Font } from "../../../../lib-font.js";

const font = new Font("GSUB type 6 subformat 2 testing");

describe("GSUB 6.2 checks", () => {
  beforeAll(async (done) => {
    font.onerror = (err) => {
      throw err;
    };
    font.onload = async () => done();
    font.src = `./fonts/Bangers-Regular.ttf`;
  });

  test("font loaded", () => {
    expect(font.opentype).toBeDefined();
  });

  test("has all expected type 7 redirects", () => {
    const subtables = [];
    const sequence = [];
    const { GSUB } = font.opentype.tables;

    // run through all scripts
    GSUB.getSupportedScripts().forEach((script) => {
      // and all languages for each script
      GSUB.getSupportedLangSys(script).forEach((lang) => {
        let langSysTable = GSUB.getLangSysTable(script, lang);
        // and all features for each langauge
        GSUB.getFeatures(langSysTable).forEach((feature) => {
          // and all lookups for each feature
          feature.lookupListIndices.forEach((id) => {
            const lookup = GSUB.getLookup(id);
            const type = lookup.lookupType;
            const cnt = lookup.subTableCount;
            // and all subtables for each lookup
            for (let i = 0; i < cnt; i++) {
              const subtable = lookup.getSubTable(i);
              const { type: sType, format } = subtable;
              subtables.push(subtable);
              sequence.push([id, type, lang, i, sType, format]);
            }
          });
        });
      });
    });

    expect(sequence.slice(0, 30)).toEqual([
      [0, 1, "dflt", 0, 1, 2],
      [1, 3, "dflt", 0, 3, 1],
      [20, 1, "dflt", 0, 1, 2],
      [2, 4, "dflt", 0, 4, 1],
      [3, 6, "dflt", 0, 6, 2],
      [5, 6, "dflt", 0, 6, 3],
      [5, 6, "dflt", 1, 6, 3],
      [7, 6, "dflt", 0, 6, 2],
      [9, 2, "dflt", 0, 2, 1],
      [16, 4, "dflt", 0, 4, 1],
      [17, 6, "dflt", 0, 6, 3],
      [17, 6, "dflt", 1, 6, 3],
      [19, 4, "dflt", 0, 4, 1],
      [15, 1, "dflt", 0, 1, 1],
      [21, 1, "dflt", 0, 1, 1],
      [0, 1, "dflt", 0, 1, 2],
      [1, 3, "dflt", 0, 3, 1],
      [20, 1, "dflt", 0, 1, 2],
      [2, 4, "dflt", 0, 4, 1],
      [3, 6, "dflt", 0, 6, 2],
      [5, 6, "dflt", 0, 6, 3],
      [5, 6, "dflt", 1, 6, 3],
      [7, 6, "dflt", 0, 6, 2],
      [9, 2, "dflt", 0, 2, 1],
      [9, 2, "dflt", 0, 2, 1],
      [16, 4, "dflt", 0, 4, 1],
      [17, 6, "dflt", 0, 6, 3],
      [17, 6, "dflt", 1, 6, 3],
      [19, 4, "dflt", 0, 4, 1],
      [15, 1, "dflt", 0, 1, 1],
    ]);

    // I have no idea if this is correct atm
    const lookup6dot2 = subtables[4];
    expect(lookup6dot2).toEqual({
      type: 6,
      format: 2,
      coverageOffset: 432,
      backtrackClassDefOffset: 468,
      inputClassDefOffset: 612,
      lookaheadClassDefOffset: 672,
      chainSubClassSetCount: 3,
      chainSubClassSetOffsets: [460, 472, 472],
    });

    // I have no idea if this is correct atm
    const classSet = lookup6dot2.getChainSubClassSet(1);
    expect(classSet).toEqual({
      chainSubClassRuleCount: 1,
      chainSubClassRuleOffsets: [512],
    });

    // I have no idea if this is correct atm
    const subclass = classSet.getSubClass(0);
    expect(subclass).toEqual({
      backtrackGlyphCount: 0,
      backtrackSequence: [],
      inputGlyphCount: 1,
      inputSequence: [],
      lookaheadGlyphCount: 1,
      lookaheadSequence: [1],
      substLookupRecords: [
        {
          glyphSequenceIndex: 0,
          lookupListIndex: 4,
        },
      ],
      substitutionCount: 1,
    });
  });

  test("getInputClassDef returns class definitions for i and j", () => {
    const { GSUB } = font.opentype.tables;
    const lookup = GSUB.getLookup(3);
    const subtable = lookup.getSubTable(0);

    const inputClassDef = subtable.getInputClassDef();

    expect(inputClassDef.classFormat).toBe(2);

    expect(inputClassDef.classRangeRecords).toEqual([
      { startGlyphID: 272, endGlyphID: 272, class: 2 }, // i
      { startGlyphID: 288, endGlyphID: 288, class: 1 }, // j
    ]);
  });
});
