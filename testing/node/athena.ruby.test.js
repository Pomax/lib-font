import { Font } from "../../Font.js";
import { testGSUB } from "./gsub/test-gsub.js";

const font = new Font("athena ruby");

describe("Basic font testing", () => {
  beforeAll((done) => {
    font.onerror = (err) => {
      throw err;
    };
    font.onload = async () => done();
    font.src = "./fonts/AthenaRuby_b018.ttf";
  });

  test("font loaded", () => {
    expect(font.opentype).toBeDefined();
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
