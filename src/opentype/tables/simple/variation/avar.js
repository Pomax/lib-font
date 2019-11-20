import { SimpleTable } from "../simple-table.js";
import lazy from "../../../lazy.js";

/**
 * The OpenType `avar` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/avar
 */
class avar extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(`avar`, dict, dataview);
    }
}

export { avar };
