import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `LTSH` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/LTSH
*/
class LTSH extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`LTSH`, dict, dataview);
    }
}

export { LTSH };
