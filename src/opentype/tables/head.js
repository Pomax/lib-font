import { Parser } from "../../parser.js";

/**
* The OpenType `head` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/head
*/
class head {
    constructor(dict, dataview) {
        const p = new Parser(`head`, dict, dataview);
        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.fontRevision = p.fixed;
        this.checkSumAdjustment = p.uint32;
        this.magicNumber = p.uint32;
        this.flags = p.flags(16);
        this.unitsPerEm = p.uint16;
        this.created = p.longdatetime;
        this.modified = p.longdatetime;
        this.xMin = p.int16;
        this.yMin = p.int16;
        this.xMax = p.int16;
        this.yMax = p.int16;
        this.macStyle = p.flags(16);
        this.lowestRecPPEM = p.uint16;
        this.fontDirectionHint = p.uint16;
        this.indexToLocFormat = p.uint16;
        this.glyphDataFormat = p.uint16;
        p.verifyLength();
    }
}

export { head };
