import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `PCLT` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/PCLT
*/
class PCLT extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`PCLT`, dict, dataview);
    }
}

export { PCLT };
