import { ParsedData } from "../../../../parser.js";
import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
 * The OpenType `sbix` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/sbix
 *
 * Notes:
 *   The glyph count is derived from the 'maxp' table. Advance and side-bearing
 *   glyph metrics are stored in the 'hmtx' table for horizontal layout, and
 *   the 'vmtx' table for vertical layout.
 *
 */
class sbix extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);

    this.version = p.uint16;
    this.flags = p.flags(16);
    this.numStrikes = p.uint32;
    lazy(this, `strikeOffsets`, () =>
      [...new Array(this.numStrikes)].map((_) => p.offset32)
    ); // from the beginning of the 'sbix' table
  }

  // TODO: add a strike accessor
}

class Strike extends ParsedData {
  constructor(p, numGlyphs) {
    this.ppem = p.uint16;
    this.ppi = p.uint16;
    lazy(this, `glyphDataOffsets`, () =>
      [...new Array(numGlyphs + 1)].map((_) => p.offset32)
    ); // from the beginning of the strike data header
  }

  // TODO: add a glyph data accessor
}

class GlyphData {
  constructor(p) {
    this.originOffsetX = p.int16;
    this.originOffsetY = p.int16;
    this.graphicType = p.tag;

    // The actual embedded graphic data has a byte length that is inferred from sequential
    // entries in the strike.glyphDataOffsets array + the fixed size (8 bytes) of the preceding fields.
    const len = 0;
    lazy(this, `data`, () => p.readBytes(len));

    // TODO: make this.data load in the correct data
  }
}

export { sbix };
