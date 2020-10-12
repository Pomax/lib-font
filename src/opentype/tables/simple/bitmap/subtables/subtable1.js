import { IndexSubHeader } from "../shared.js";

/**
 * IndexSubTable1: variable-metrics glyphs with 4-byte offsets
 */
class Subtable1 {
  constructor(p) {
    super(p);
    this.header = new IndexSubHeader(p);

    /*
          The documentation says:

            offsetArray[glyphIndex] + imageDataOffset = glyphData sizeOfArray = (lastGlyph - firstGlyph + 1) + 1 + 1 pad if needed

          To which I say: "... what? O_o"

          TODO: figure out how to size this array
        */
    const len = 0;
    this.offsetArray = [...new Array(len)].map((_) => p.offset32);
  }
}

export { Subtable1 };
