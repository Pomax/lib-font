import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `EBDT` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/EBDT
*/
class EBDT extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`EBDT`, dict, dataview);
    }
}

export { EBDT };
