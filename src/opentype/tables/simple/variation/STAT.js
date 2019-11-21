import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `STAT` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/STAT
 */
class STAT extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(dict, dataview);
    }
}

export { STAT };
