// opentype tables
import { head } from "./tables/head.js";
import { fvar } from "./tables/fvar.js";
import { OS2 } from "./tables/OS2.js";
import { gasp } from "./tables/gasp.js";

/**
 * Table factory
 * @param {*} dict
 * @param {*} dataview
 */
function createTable(dict, dataview) {
    if (dict.tag === `head`) return new head(dict, dataview);
    if (dict.tag === `gasp`) return new gasp(dict, dataview);
    if (dict.tag === `fvar`) return new fvar(dict, dataview);
    if (dict.tag === `OS/2`) return new OS2(dict, dataview);
    // further code goes here once more table parsers exist
    return {};
}

export default createTable;
