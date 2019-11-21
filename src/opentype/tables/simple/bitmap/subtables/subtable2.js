import { IndexSubHeader, BigGlyphMetrics } from "../shared.js";

/**
 * IndexSubTable2: all glyphs have identical metrics
 */
class Subtable2 {
    constructor(p) {
        super(p);
        this.header = new IndexSubHeader(p);
        this.imageSize = p.uint32;
        this.bigMetrics = new BigGlyphMetrics(p);
    }
}

export { Subtable2 };
