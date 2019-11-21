import lazy from "../../../lazy.js";
import { SimpleTable } from "../simple-table.js";

/**
 * The OpenType `GDEF` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/GDEF
 */
class GDEF extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(dict, dataview);
    }
}

export { GDEF };
