import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `VDMX` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/VDMX
*/
class VDMX extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`VDMX`, dict, dataview);
    }
}

export { VDMX };
