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
              const { type: sType, format } = lookup.getSubTable(i);
              sequence.push([id, type, lang, i, sType, format]);
            }
          });
        });
      });
    });

    // I do not know if this is the correct information right now
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
  });
});
