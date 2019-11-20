import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `CBLC` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/CBLC
*/
class CBLC extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`CBLC`, dict, dataview);
    }
}

export { CBLC };
