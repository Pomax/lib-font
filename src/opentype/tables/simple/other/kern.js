import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `kern` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/kern
*/
class kern extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`kern`, dict, dataview);
    }
}

export { kern };
