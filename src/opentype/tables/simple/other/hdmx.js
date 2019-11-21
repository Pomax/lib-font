import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `hdmx` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/hdmx
*/
class hdmx extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(`hdmx`, dict, dataview);
    }
}

export { hdmx };
