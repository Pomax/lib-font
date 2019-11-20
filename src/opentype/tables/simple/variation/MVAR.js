import { SimpleTable } from "../simple-table.js";
import lazy from "../../../lazy.js";

/**
 * The OpenType `MVAR` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/MVAR
 */
class MVAR extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(`MVAR`, dict, dataview);
    }
}

export { MVAR };
