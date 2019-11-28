import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
* The OpenType `MERG` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/MERG
*/
class MERG extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
        this.version = p.uint16;
        this.mergeClassCount = p.uint16;
        this.mergeDataOffset = p.offset16; // from... where?
        this.classDefCount = p.uint16;
        this.offsetToClassDefOffsets = p.offset16; 	// from the start of the MERG table.

        // This is a big 2D array
        lazy(this, `mergeEntryMatrix`, () => [...new Array(this.mergeClassCount)].map(_ => p.readBytes(this.mergeClassCount)));

        // Once you have this data, you're on your own. Please see 
        // https://docs.microsoft.com/en-us/typography/opentype/spec/merg#processing
        // for the details on what to do. But you probably already know that.
    }
}

export { MERG };
