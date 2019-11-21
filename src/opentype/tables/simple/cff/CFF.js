import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
* The OpenType `CFF` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/CFF
*/
class CFF extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`CFF`, dict, dataview);
        lazy(this, `data`, () => p.readBytes());
    }
}

export { CFF };
