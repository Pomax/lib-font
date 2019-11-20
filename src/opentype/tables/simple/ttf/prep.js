import { SimpleTable } from "../simple-table.js";

/**
* The OpenType `prep` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/prep
*/
class prep extends SimpleTable {
    constructor(dict, dataview, tables) {
        const { p } =  super(`prep`, dict, dataview);
    }
}

export { prep };
