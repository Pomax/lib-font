import { Parser } from "../../parser.js";

/**
 * the OpenType `fvar` table.
 */
class fvar {
    constructor(dict, dataview) {
        const p = new Parser(`fvar2`, dict, dataview);
        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.axesArrayOffset = p.uint16;
        p.uint16;
        this.axisCount = p.uint16;
        this.axisSize = p.uint16;
        this.instanceCount = p.uint16;
        this.instanceSize = p.uint16;

        const recordOffset = p.offset;
        this.axes = [... new Array(this.axisCount)].map((_,i) =>
            new VariationAxisRecord(dataview, recordOffset + i * 4)
        );
    }
}

/**
 * The fvar variation axis record class
 */
class VariationAxisRecord {
    constructor(dataview, offset) {
        const p = new Parser(`variation axis record`, { offset }, dataview);
        this.tag = p.tag;
        this.minValue = p.fixed;
        this.defaultValue = p.fixed;
        this.maxValue = p.fixed;
        this.flags = p.flags(16);
        this.axisNameID = p.uint16;
    }
}

export { fvar };
