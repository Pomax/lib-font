import { Font } from "../../lib-font.js";
import { testGSUB } from "./gsub/test-gsub.js";

const font = new Font("mehr nastaliq");

describe("Basic font testing", () => {
  beforeAll((done) => {
    font.onerror = (err) => {
      throw err;
    };
    font.onload = async () => done();
    font.src = "./fonts/MehrNastaliqWeb-Regular.ttf";
  });

  test("font loaded", () => {
    expect(font.opentype).toBeDefined();
  });

  test("GSUB format 6/8 functionality", () => {
    testGSUB(font, {
      script: [],
      feature: [],
      lookup: [
        type6LookupTest,
        type8LookupTest,
      ]
    })
  });
});

function type6LookupTest(font, script, langsys, feature, lookupId, lookup) {
  if (lookup.lookupType !== 6) return;
  // console.log(script, langsys, feature, lookupId);
  console.log(lookup);
  for(let i=0; i<lookup.subTableCount; i++) {
    let subtable = lookup.getSubTable(i);
    console.log(`format: ${subtable.substFormat}`);
  }
}

function type8LookupTest(font, script, langsys, feature, lookupId, lookup) {
  if (lookup.lookupType !== 8) return;
  // console.log(script, langsys, feature, lookupId);
}
