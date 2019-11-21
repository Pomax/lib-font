import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `fpgm` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/fpgm
*/
class fpgm extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
        //
        // The actual data is n instructions, where n is the number of
        // uint8 items that fit in the size of the table... so, table.length
        //
        lazy(this, `instructions`, () => [...new Array(dict.length)].map(_ => p.uint8));
    }
}

export { fpgm };
