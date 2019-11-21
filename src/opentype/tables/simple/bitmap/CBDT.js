import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `CBDT` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/CBDT
*/
class CBDT extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`CBDT`, dict, dataview);
    }
}

export { CBDT };
