import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `VVAR` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/VVAR
 */
class VVAR extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(`VVAR`, dict, dataview);
    }
}

export { VVAR };
