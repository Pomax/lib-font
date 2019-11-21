import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `MERG` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/MERG
*/
class MERG extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`MERG`, dict, dataview);
    }
}

export { MERG };
