import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `COLR` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/COLR
*/
class COLR extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`COLR`, dict, dataview);
    }
}

export { COLR };
