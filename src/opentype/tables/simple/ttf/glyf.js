import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `glyf` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/glyf
*/
class glyf extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
    }
}

export { glyf };
