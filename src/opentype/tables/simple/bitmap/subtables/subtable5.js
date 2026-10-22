import { IndexSubHeader, BigGlyphMetrics } from "../shared.js";
import lazy from "../../../../../lazy.js";
import { ParsedData } from "../../../../../parser.js";

/**
 * IndexSubTable5: constant-metrics glyphs with sparse glyph codes
 */
class Subtable5 extends ParsedData {
  constructor(p) {
    super(p);

    this.header = new IndexSubHeader(p);
    this.imageSize = p.uint32;
    this.bigMetrics = new BigGlyphMetrics(p);
    this.numGlyphs = p.uint32;

    lazy(this, `glyphIdArray`, () =>
      [...new Array(this.numGlyphs)].map((_) => p.uint16)
    );
  }
}

export { Subtable5 };
