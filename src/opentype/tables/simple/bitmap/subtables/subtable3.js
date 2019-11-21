import { IndexSubHeader } from "../shared.js";

/**
 * IndexSubTable3: variable-metrics glyphs with 2-byte offsets
 */
class Subtable3 {
    constructor(p) {
        super(p);
        this.header = new IndexSubHeader(p);

        /*
          The documentation says:

            offsetArray[glyphIndex] + imageDataOffset = glyphData sizeOfArray = (lastGlyph - firstGlyph + 1) + 1 + 1 pad if needed

          To which I again say: "... what? O_o"

          TODO: figure out how to size this array
        */
       const len = 0
       this.offsetArray = [...new Array(len)].map(_ => p.offset16);
    }
}

export { Subtable3 };
