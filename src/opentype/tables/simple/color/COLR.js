import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `COLR` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/COLR
*/
class COLR extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
    }
}

export { COLR };
