import lazy from "../../../lazy.js";
import { SimpleTable } from "../simple-table.js";

/**
 * The OpenType `MATH` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/MATH
 */
class MATH extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(`MATH`, dict, dataview);
    }
}

export { MATH };
