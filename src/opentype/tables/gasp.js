import { Parser } from "../../parser.js";
import lazy from "../../lazy.js";

/**
 * The OpenType `gasp` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/gasp
 */
class gasp {
    constructor(dict, dataview) {
        const p = new Parser(`gasp`, dict, dataview);
        this.version = p.uint16;
        this.numRanges = p.uint16;

        const getter = () => [... new Array(this.numRanges)].map(_ => new GASPRange(p));
        lazy(this, `gaspRanges`, getter);
    }
}

/**
 * GASPRange record
 */
class GASPRange {
    constructor(p) {
        this.rangeMaxPPEM = p.uint16;
        this.rangeGaspBehavior = p.uint16;
    }
}

export { gasp };
