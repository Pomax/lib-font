import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `sbix` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/sbix
*/
class sbix extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`sbix`, dict, dataview);
    }
}

export { sbix };
