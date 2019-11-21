import { IndexSubHeader } from "../shared.js";
import lazy from "../../../../../lazy.js";

/**
 * IndexSubTable4: variable-metrics glyphs with sparse glyph codes
 */
class Subtable4 {
    constructor(p) {
        super(p);

        this.header = new IndexSubHeader(p);
        this.numGlyphs = p.uint32;

        lazy(this, `glyphArray`, () => [...new Array(this.numGlyphs + 1)].map(_ => new GlyphIdOffsetPair(p)));
    }
}

class GlyphIdOffsetPair {
    constructor(p) {
        this.glyphID = p.uint16;
        this.offset = p.offset16; // Location in EBDT (TODO: figure out what "in" means)
    }
}

export { Subtable4 };
