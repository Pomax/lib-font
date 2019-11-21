import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `vmtx` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/vmtx
*/
class vmtx extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`vmtx`, dict, dataview);
    }
}

export { vmtx };
