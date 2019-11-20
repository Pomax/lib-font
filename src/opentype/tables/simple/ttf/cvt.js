import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `cvt` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/cvt
*/
class cvt extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`cvt`, dict, dataview);
    }
}

export { cvt };
