import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `fpgm` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/fpgm
*/
class fpgm extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`fpgm`, dict, dataview);
    }
}

export { fpgm };
