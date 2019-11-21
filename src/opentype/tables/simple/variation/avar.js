import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `avar` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/avar
 */
class avar extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(dict, dataview);
    }
}

export { avar };
