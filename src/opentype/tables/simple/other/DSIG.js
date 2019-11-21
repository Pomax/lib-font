import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `DSIG` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/DSIG
*/
class DSIG extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
    }
}

export { DSIG };
