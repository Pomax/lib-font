import { Parser } from "../../parser.js";

/**
    * The OpenType `head` table.
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
        let startDate = (new Date(`1904-01-01T00:00:00+0000`)).getTime();
        this.created = new Date(startDate + 1000 * parseInt(p.int64.toString()));
        this.modified = new Date(startDate + 1000 * parseInt(p.int64.toString()));
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
