import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `EBSC` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/EBSC
*/
class EBSC extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`EBSC`, dict, dataview);
    }
}

export { EBSC };
