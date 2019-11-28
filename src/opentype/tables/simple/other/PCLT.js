import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `PCLT` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/PCLT
*/
class PCLT extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
        console.warn(`This font uses a PCLT table, which is currently not supported by this parser.`);
        console.warn(`If you need this table parsed, please file an issue, or better yet, a PR.`);
    }
}

export { PCLT };
