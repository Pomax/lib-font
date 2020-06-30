import { SimpleTable } from "./tables/simple-table.js";
import lazy from "../lazy.js";
import { context } from "../../lib/context.js";

const brotliDecode = context.unbrotli;

/**
 * The WOFF2 header
 *
 * See https://www.w3.org/TR/WOFF2 for WOFF2 information
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/overview for font information
 */
class WOFF2 extends SimpleTable {
    constructor(dataview, createTable) {
        const { p } = super({ offset: 0, length: 48 }, dataview, `woff2`);
        this.signature = p.tag;
        this.flavor = p.uint32;
        this.length = p.uint32;
        this.numTables = p.uint16;
        p.uint16 // why woff2 even has any reserved bytes is a complete mystery. But it does.
        this.totalSfntSize = p.uint32;
        this.totalCompressedSize = p.uint32;
        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.metaOffset = p.uint32;
        this.metaLength = p.uint32;
        this.metaOrigLength = p.uint32;
        this.privOffset = p.uint32;
        this.privLength = p.uint32;

        p.verifyLength();

        // parse the dictionary
        this.directory = [... new Array(this.numTables)].map(_ => new Woff2TableDirectoryEntry(p));
        let dictOffset = p.currentPosition;

        // compute table byte offsets in the decompressed data
        this.directory[0].origOffset = 0;
        this.directory.forEach((e,i) => {
            let t = this.directory[i+1]
            if (t) {
                const useTransform = typeof e.transformLength !== "undefined";
                t.origOffset = e.origOffset + (useTransform ? e.transformLength : e.origLength);
            }
        });

        // then decompress the original data and lazy-bind
        let decoded = brotliDecode(new Uint8Array(dataview.buffer.slice(dictOffset)));
        buildWoff2LazyLookups(this, decoded, createTable);
    }
}

/**
 * WOFF2 Table Directory Entry
 */
class Woff2TableDirectoryEntry {
    constructor(p) {
        this.flags = p.uint8;

        const tagNumber  = this.tagNumber = this.flags & 63;
        if (tagNumber === 63) {
            this.tag = p.tag;
        } else {
            this.tag = getWOFF2Tag(tagNumber);
        }

        this.origLength = p.uint128;
        const pptVersion = this.pptVersion = this.flags >> 6;
        if (pptVersion !== 0 || ((this.tag === 'glyf' || this.tag === 'loca') && pptVersion !== 3)) {
            this.transformLength = p.uint128;
        }
        this.length = p.offset; // FIXME: we can probably calculat this without asking the parser
    }
}

/**
 * Build late-evaluating properties for each table in a
 * woff/woff2 font, so that accessing a table via the
 * woff.tables.tableName or woff2.tables.tableName
 * property kicks off a table parse on first access.
 *
 * @param {*} woff the woff or woff2 font object
 * @param {DataView} dataview passed when dealing with woff
 * @param {buffer} decoded passed when dealing with woff2
 */
function buildWoff2LazyLookups(woff2, decoded, createTable) {
    woff2.tables = {};
    woff2.directory.forEach(entry => {
        lazy(woff2.tables, entry.tag.trim(), () => {
            const useTransform = typeof entry.transformLength !== "undefined";
            const data = decoded.slice(entry.origOffset, entry.origOffset + (useTransform ? entry.transformLength : entry.origLength));
            return createTable(woff2.tables, { tag: entry.tag, offset: 0, length: entry.origLength }, new DataView(data.buffer));
        });
    });
}

/**
 * WOFF2 uses a numbered tag registry, such that only unknown tables require a 4 byte tag
 * in the WOFF directory entry struct. Everything else uses a uint8. Nice and tidy.
 * @param {*} flag
 */
function getWOFF2Tag(flag) {
    return [
        `cmap`,`head`,`hhea`,`hmtx`,`maxp`,`name`,`OS/2`,`post`,`cvt `,`fpgm`,`glyf`,`loca`,`prep`,
        `CFF `,`VORG`,`EBDT`,`EBLC`,`gasp`,`hdmx`,`kern`,`LTSH`,`PCLT`,`VDMX`,`vhea`,`vmtx`,`BASE`,
        `GDEF`,`GPOS`,`GSUB`,`EBSC`,`JSTF`,`MATH`,`CBDT`,`CBLC`,`COLR`,`CPAL`,`SVG `,`sbix`,`acnt`,
        `avar`,`bdat`,`bloc`,`bsln`,`cvar`,`fdsc`,`feat`,`fmtx`,`fvar`,`gvar`,`hsty`,`just`,`lcar`,
        `mort`,`morx`,`opbd`,`prop`,`trak`,`Zapf`,`Silf`,`Glat`,`Gloc`,`Feat`,`Sill`
    ][flag];
}

export { WOFF2 };
