import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `loca` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/loca
*/
class loca extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
    }
}

export { loca };
