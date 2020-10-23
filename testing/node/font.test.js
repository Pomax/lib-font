import { Font } from "../../../Font.js";
import { testGSUB } from "./gsub/test-gsub.js";

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

  test("Glyph support", () => {
    expect(font.supports(`f`)).toBe(true);
    expect(font.supports(`i`)).toBe(true);
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
    testGSUB(font.opentype.tables);
  });
});
