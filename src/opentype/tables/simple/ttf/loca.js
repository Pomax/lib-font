import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
* The OpenType `loca` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/loca
*/
class loca extends SimpleTable {
    constructor(dict, dataview, hmtx, maxp) {
        const { p } =  super(dict, dataview);
        const n = maxp.numGlyphs + 1; // "plus one" because the offset list needs one extra element to determine the block length for the last supported glyph.
        if (hmtx.indexToLocFormat === 0) {
            this.x2 = true;
            lazy(this, `offsets`, () => [...new Array(n)].map(_ => p.offset16));
        } else {
            lazy(this, `offsets`, () => [...new Array(n)].map(_ => p.offset32));
        }
    }

    getGlyphDataOffsetAndLength(glyphID) {
        let offset = this.offsets[glyphID] * this.x2 ? 2 : 1;
        let nextOffset = this.offsets[glyphID + 1] * this.x2 ? 2 : 1;
        return { offset, length: nextOffset - offset };
    }
}

export { loca };
