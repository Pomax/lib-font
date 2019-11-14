// opentype tables
import { fvar } from "./tables/fvar.js";
import { gasp } from "./tables/gasp.js";
import { head } from "./tables/head.js";
import { hhea } from "./tables/hhea.js";
import { hmtx } from "./tables/hmtx.js";
import { maxp } from "./tables/maxp.js";
import { name } from "./tables/name.js";
import { OS2  } from "./tables/OS2.js";
import { post } from "./tables/post.js";

/**
 * Table factory
 * @param {*} dict an object of the form: { tag: "string", offset: <number>, [length: <number>]}
 * @param {*} dataview a DataView object over an ArrayBuffer of Uint8Array
 */
function createTable(tables, dict, dataview) {
    if (dict.tag === `fvar`) return new fvar(dict, dataview);
    if (dict.tag === `gasp`) return new gasp(dict, dataview);
    if (dict.tag === `head`) return new head(dict, dataview);
    if (dict.tag === `hhea`) return new hhea(dict, dataview);
    if (dict.tag === `hmtx`) return new hmtx(tables, dict, dataview);
    if (dict.tag === `maxp`) return new maxp(dict, dataview);
    if (dict.tag === `name`) return new name(dict, dataview);
    if (dict.tag === `OS/2`) return new OS2(dict, dataview);
    if (dict.tag === `post`) return new post(dict, dataview);
    // further code goes here once more table parsers exist
    return {};
}

export default createTable;
