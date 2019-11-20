// opentype tables
import { cmap } from "./simple/cmap.js";
import { gasp } from "./simple/ttf/gasp.js";
import { head } from "./simple/head.js";
import { hhea } from "./simple/hhea.js";
import { hmtx } from "./simple/hmtx.js";
import { maxp } from "./simple/maxp.js";
import { name } from "./simple/name.js";
import { OS2  } from "./simple/OS2.js";
import { post } from "./simple/post.js";

// opentype tables that rely on the "common layout tables" data structures
import { BASE } from "./advanced/BASE.js";
import { GSUB } from "./advanced/GSUB.js";
import { GPOS } from "./advanced/GPOS.js";

// SVG tables... err... table
import { SVG } from "./simple/SVG.js";

// Variable fonts
import { fvar } from "./simple/variation/fvar.js";

/**
 * Table factory
 * @param {*} dict an object of the form: { tag: "string", offset: <number>, [length: <number>]}
 * @param {*} dataview a DataView object over an ArrayBuffer of Uint8Array
 */
export default function createTable(tables, dict, dataview) {
    if (dict.tag === `cmap`) return new cmap(dict, dataview);
    if (dict.tag === `fvar`) return new fvar(dict, dataview);
    if (dict.tag === `gasp`) return new gasp(dict, dataview);
    if (dict.tag === `head`) return new head(dict, dataview);
    if (dict.tag === `hhea`) return new hhea(dict, dataview);
    if (dict.tag === `hmtx`) return new hmtx(dict, dataview, tables);
    if (dict.tag === `maxp`) return new maxp(dict, dataview);
    if (dict.tag === `name`) return new name(dict, dataview);
    if (dict.tag === `OS/2`) return new OS2(dict, dataview);
    if (dict.tag === `post`) return new post(dict, dataview);

    if (dict.tag === `BASE`) return new BASE(dict, dataview);
    if (dict.tag === `GSUB`) return new GSUB(dict, dataview);
    if (dict.tag === `GPOS`) return new GPOS(dict, dataview);

    if (dict.tag === `SVG `) return new SVG(dict, dataview);

    // further code goes here once more table parsers exist
    return {};
};
