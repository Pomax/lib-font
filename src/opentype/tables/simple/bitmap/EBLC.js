import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `EBLC` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/EBLC
*/
class EBLC extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`EBLC`, dict, dataview);
    }
}

export { EBLC };
