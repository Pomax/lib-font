import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `CFF2` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/CFF2
*/
class CFF2 extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`CFF2`, dict, dataview);
    }
}

export { CFF2 };
