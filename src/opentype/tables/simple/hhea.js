import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `hhea` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/hhea
*/
class hhea extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(`hhea`, dict, dataview);

        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.ascender = p.fword;
        this.descender = p.fword;
        this.lineGap = p.fword;
        this.advanceWidthMax = p.ufword;
        this.minLeftSideBearing = p.fword;
        this.minRightSideBearing = p.fword;
        this.xMaxExtent = p.fword;
        this.caretSlopeRise = p.int16;
        this.caretSlopeRun = p.int16;
        this.caretOffset = p.int16;
        p.int16;
        p.int16;
        p.int16;
        p.int16;
        this.metricDataFormat = p.int16;
        this.numberOfHMetrics = p.uint16;

        p.verifyLength();
    }
}

export { hhea };
