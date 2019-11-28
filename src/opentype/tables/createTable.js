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

// CFF
import { CFF } from "./simple/cff/CFF.js";
import { CFF2 } from "./simple/cff/CFF2.js";
import { VORG } from "./simple/cff/VORG.js";

// bitmap
import { EBLC } from "./simple/bitmap/EBLC.js";
import { EBDT } from "./simple/bitmap/EBDT.js";
import { EBSC } from "./simple/bitmap/EBSC.js";
import { CBLC } from "./simple/bitmap/CBLC.js";
import { CBDT } from "./simple/bitmap/CBDT.js";
import { sbix } from "./simple/bitmap/sbix.js";

// "other" tables
import { DSIG } from "./simple/other/DSIG.js";
import { hdmx } from "./simple/other/hdmx.js";
import { LTSH } from "./simple/other/LTSH.js";

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

    if (dict.tag === `CFF `) return new CFF(dict, dataview);
    if (dict.tag === `CFF2`) return new CFF2(dict, dataview);
    if (dict.tag === `VORG`) return new VORG(dict, dataview);

    if (dict.tag === `EBLC`) return new EBLC(dict, dataview);
    if (dict.tag === `EBDT`) return new EBDT(dict, dataview);
    if (dict.tag === `EBSC`) return new EBSC(dict, dataview);
    if (dict.tag === `CBLC`) return new CBLC(dict, dataview);
    if (dict.tag === `CBDT`) return new CBDT(dict, dataview);
    if (dict.tag === `sbix`) return new sbix(dict, dataview);

    if (dict.tag === `DSIG`) return new DSIG(dict, dataview);
    if (dict.tag === `LTSH`) return new LTSH(dict, dataview);
    if (dict.tag === 'hdmx') return new hdmx(dict, dataview, tables.hmtx);

    // further code goes here once more table parsers exist
    return {};
};
