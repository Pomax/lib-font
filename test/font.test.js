import { Font } from "../Font.js";

const font = new Font("basic font testing");

describe("Basic font testing", () => {
  beforeAll((done) => {
    font.onerror = (err) => {
      throw err;
    };
    font.onload = async () => done();
    font.src = "./fonts/SourceCodePro-Regular.ttf";
  });

  test("font loaded", () => {
    expect(font.opentype).toBeDefined();
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
    const GSUB = font.opentype.tables.GSUB;
    expect(GSUB).toBeDefined();

    const scripts = GSUB.getSupportedScripts();
    expect(scripts).toEqual([`DFLT`, `cyrl`, `grek`, `latn`]);

    const latn = GSUB.getScriptTable(`latn`);
    const langsys = GSUB.getSupportedLangSys(latn);

    expect(langsys).toEqual([`dflt`, `ATH `, `NSM `, `SKS `]);

    const lsTable = GSUB.getLangSysTable(latn, `NSM `);
    const features = GSUB.getFeatures(lsTable);

    expect(features.length).toBe(34);

    const tags = features.map((f) => f.featureTag);
    const expected = [
      `case`,
      `ccmp`,
      `cv01`,
      `cv02`,
      `cv04`,
      `cv06`,
      `cv07`,
      `cv08`,
      `cv09`,
      `cv10`,
      `cv11`,
      `cv12`,
      `cv14`,
      `cv15`,
      `cv16`,
      `cv17`,
      `dnom`,
      `frac`,
      `locl`,
      `numr`,
      `onum`,
      `ordn`,
      `salt`,
      `sinf`,
      `ss01`,
      `ss02`,
      `ss03`,
      `ss04`,
      `ss05`,
      `ss06`,
      `ss07`,
      `subs`,
      `sups`,
      `zero`,
    ];
    expect(tags).toEqual(expected);
  });
});
