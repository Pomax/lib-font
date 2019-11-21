import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `vhea` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/vhea
*/
class vhea extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
    }
}

export { vhea };
