import { SimpleTable } from "../simple-table.js";
import lazy from "../../../lazy.js";

/**
 * The OpenType `cvar` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/cvar
 */
class cvar extends SimpleTable {
    constructor(dict, dataview) {
        const { p } = super(`cvar`, dict, dataview);
    }
}

export { cvar };
