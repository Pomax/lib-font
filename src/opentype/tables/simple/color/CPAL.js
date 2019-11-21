import { SimpleTable } from "../../simple-table.js";
/**
* The OpenType `CPAL` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/CPAL
*/
class CPAL extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`CPAL`, dict, dataview);
    }
}

export { CPAL };
