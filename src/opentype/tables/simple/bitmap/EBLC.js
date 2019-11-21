import { SimpleTable } from "../../simple-table.js";
import { lazy } from "../../../../lazy.js";
import { ParsedData } from "../../../../parser.js";

/**
* The OpenType `EBLC` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/EBLC
*/
class EBLC extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`EBLC`, dict, dataview);

        this.majorVersion = uint16;
        this.minorVersion = uint16;
        this.numSizes = uint32;

        lazy(this, `bitMapSizes`, () => [... new Array(this.numSizes)].map(_ => new BitmapSize(p)));
    }
}

class BitmapSize {
    constructor(p) {
        this.indexSubTableArrayOffset = p.offset32; // from beginning of CBLC
        this.indexTablesSize = p.uint32;
        this.numberofIndexSubTables = p.uint32;
        this.colorRef = p.uint32;
        this.hori = new SbitLineMetrics(p);
        this.vert = new SbitLineMetrics(p);
        this.startGlyphIndex = p.uint16;
        this.endGlyphIndex = p.uint16;
        this.ppemX = p.uint8;
        this.ppemY = p.uint8;
        this.bitDepth = p.uint8;
        this.flags = p.int8;
    }
}

class SbitLineMetrics {
    constructor(p) {
        this.ascender = p.int8;
        this.descender = p.int8;
        this.widthMax = p.uint8;
        this.caretSlopeNumerator = p.int8;
        this.caretSlopeDenominator = p.int8;
        this.caretOffset = p.int8;
        this.minOriginSB = p.int8;
        this.minAdvanceSB = p.int8;
        this.maxBeforeBL = p.int8;
        this.minAfterBL = p.int8;
        this.pad1 = p.int8;
        this.pad2 = p.int8;
    }
}

class BigGlyphMetrics {
    constructor(p) {
        this.height = uint8;
        this.width = uint8;
        this.horiBearingX = int8;
        this.horiBearingY = int8;
        this.horiAdvance = uint8;
        this.vertBearingX = int8;
        this.vertBearingY = int8;
        this.vertAdvance = uint8;
    }
}

class SmallGlyphMetrics {
    constructor(p) {
        this.height = p.uint8;
        this.width = p.uint8;
        this.bearingX = p.int8;
        this.bearingY = p.int8;
        this.advance = p.uint8;
    }
}

class IndexSubTableArray {
    constructor(p) {
        this.firstGlyphIndex = p.uint16;
        this.lastGlyphIndex = p.uint16;
        this.additionalOffsetToIndexSubtable = p.offset32; // from beginning of EBLC.
    }
}

class IndexSubHeader {
    constructor(p) {
        this.indexFormat = p.uint16;
        this.imageFormat = p.uint16;
        this.imageDataOffset = p.offset32 // Offset to image data in EBDT table.
    }
}

export { EBLC };
