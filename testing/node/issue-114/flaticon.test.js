import { Font } from "../../../lib-font.js";

const font = new Font("flaticon");

describe("Basic font testing", () => {
  beforeAll((done) => {
    font.onerror = (err) => {
      throw err;
    };
    font.onload = async () => done();
    font.src = "./fonts/issue-114/Flaticon.woff2";
  });

  test("font loaded", () => {
    expect(font.opentype).toBeDefined();
  });

  test("has name table", () => {
    const { name } = font.opentype.tables;

    expect(name).toBeDefined();
    expect(name.count).toBe(14);
  });
});

