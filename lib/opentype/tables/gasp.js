import { Parser } from "../../parser.js";

/**
 * GASPRange record
 */
class GASPRange {
    constructor(dataview, offset) {
        const p = new Parser("gasp range", { offset }, dataview);
        this.rangeMaxPPEM = p.uint16;
        this.rangeGaspBehavior = p.uint16;
    }
}

/**
 * The OpenType `gasp` table.
 */
class gasp {
    constructor(dict, dataview) {
        const p = new Parser(`gasp`, dict, dataview);
        this.version = p.uint16;
        this.numRanges = p.uint16;

        const gaspOffset = p.offset;
        this.gaspRange = [... new Array(this.numRanges)].map((_,i) =>
            new GASPRange(dataview, gaspOffset + i * 4)
        );
    }
}

export { gasp };
