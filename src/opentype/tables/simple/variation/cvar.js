import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
 * The OpenType `cvar` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/cvar
 */
class cvar extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(dict, dataview);
        this.majorVersion = uint16;
        this.minorVersion = uint16;
        this.tupleVariationCount = uint16;
        this.dataOffset = p.offset32; // from the start of the table

        // FIXME: this is only correct if we can properly read full Tuple Variation Header...
        lazy(this `tupleVariationHeaders`, () => [...new Array(this.tupleVariationCount)].map(_ => new TupleVariationHeader(p)));
    }
}

/**
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/otvarcommonformats
 */
class TupleVariationHeader {
    constructor(p) {
        this.variationDataSize = p.uint16;

        // tupleIndex is a packed field:
        // - the high 4 bits are flags
        // - the low 12 bits are an index into a shared tuple records array.
        this.tupleIndex = p.uint16;

        // FIXME: not all tuples are actually there, it depends on the flags.

        this.peakTuple = new Tuple(p);
        this.intermediateStartTuple = new Tuple(p);
        this.intermediateEndTuple = new Tuple(p);
    }

    get EMBEDDED_PEAK_TUPLE() { return this.tupleIndex & 0x8000 === 0x8000; }
    get INTERMEDIATE_REGION() { return this.tupleIndex & 0x4000 === 0x4000; }
    get PRIVATE_POINT_NUMBERS() { return this.tupleIndex & 0x2000 === 0x2000; }
    get realTupleIndex() { return this.tupleIndex & 0xfff; }
}

class Tuple {
    constructor(p) {
        // FIXME: what... goes in here?
    }
}

export { cvar };
