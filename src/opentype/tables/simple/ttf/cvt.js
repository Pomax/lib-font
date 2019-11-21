import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `cvt` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/cvt
*/
class cvt extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
    }
}

export { cvt };
