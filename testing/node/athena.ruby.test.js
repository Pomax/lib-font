import { Font } from "../../Font.js";

const font = new Font("basic font testing");

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

    // ...code forthcoming...

  });
});
