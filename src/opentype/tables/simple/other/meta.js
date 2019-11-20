import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `meta` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/meta
*/
class meta extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`meta`, dict, dataview);
    }
}

export { meta };
