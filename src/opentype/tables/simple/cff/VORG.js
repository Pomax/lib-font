import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `VORG` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/VORG
*/
class VORG extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`VORG`, dict, dataview);
    }
}

export { VORG };
