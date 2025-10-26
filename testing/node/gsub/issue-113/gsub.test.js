import { Font } from "../../../../lib-font.js";

const font = new Font("GSUB type 7 redirect testing");

describe("GSUB type 7 checks", () => {
  beforeAll(async (done) => {
    font.onerror = (err) => {
      throw err;
    };
    font.onload = async () => done();
    font.src = `./fonts/Lato-Regular.ttf`;
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

    expect(sequence.slice(0,30)).toEqual([
      [26, 7, "dflt", 0, 6, 3],
      [26, 7, "dflt", 1, 6, 3],
      [28, 7, "dflt", 0, 6, 3],
      [28, 7, "dflt", 1, 6, 3],
      [28, 7, "dflt", 2, 6, 3],
      [28, 7, "dflt", 3, 6, 3],
      [2, 7, "dflt", 0, 1, 2],
      [32, 7, "dflt", 0, 4, 1],
      [20, 7, "dflt", 0, 1, 2],
      [4, 7, "dflt", 0, 6, 3],
      [4, 7, "dflt", 1, 6, 3],
      [4, 7, "dflt", 2, 6, 3],
      [4, 7, "dflt", 3, 6, 3],
      [4, 7, "dflt", 4, 6, 3],
      [5, 7, "dflt", 0, 6, 3],
      [6, 7, "dflt", 0, 6, 3],
      [7, 7, "dflt", 0, 6, 3],
      [8, 7, "dflt", 0, 6, 3],
      [9, 7, "dflt", 0, 6, 3],
      [10, 7, "dflt", 0, 6, 3],
      [11, 7, "dflt", 0, 6, 3],
      [12, 7, "dflt", 0, 6, 3],
      [13, 7, "dflt", 0, 6, 3],
      [14, 7, "dflt", 0, 6, 3],
      [16, 7, "dflt", 0, 6, 3],
      [17, 7, "dflt", 0, 6, 3],
      [30, 7, "dflt", 0, 4, 1],
      [31, 7, "dflt", 0, 4, 1],
      [22, 7, "dflt", 0, 1, 2],
      [19, 7, "dflt", 0, 1, 2],
    ]);
  });
});
