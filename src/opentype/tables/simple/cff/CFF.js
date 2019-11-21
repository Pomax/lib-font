import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `CFF` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/CFF
*/
class CFF extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`CFF`, dict, dataview);
    }
}

export { CFF };
