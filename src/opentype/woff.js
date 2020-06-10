import { SimpleTable } from "./tables/simple-table.js";
import lazy from "../lazy.js";

// Font.js expects this to be loaded seperately and made available
// as a global object on `window`
// const gzipDecode = (window.pako ? window.pako.inflate : undefined);

/**
 * The WOFF header
 *
 * See https://www.w3.org/TR/WOFF for WOFF information
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/overview for font information
 */
class WOFF extends SimpleTable {
    constructor(dataview, createTable) {
        const { p } = super({ offset: 0, length: 44 }, dataview, `woff`);

        this.signature = p.tag;
        this.flavor = p.uint32;
        this.length = p.uint32;
        this.numTables = p.uint16;
        p.uint16;
        this.totalSfntSize = p.uint32;
        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.metaOffset = p.uint32;
        this.metaLength = p.uint32;
        this.metaOrigLength = p.uint32;
        this.privOffset = p.uint32;
        this.privLength = p.uint32;

        p.verifyLength();

        this.directory = [... new Array(this.numTables)].map(_ => new WoffTableDirectoryEntry(p));
        buildWoffLazyLookups(this, dataview, createTable);
    }
}

/**
 * ...
 */
class WoffTableDirectoryEntry {
    constructor(p) {
        this.tag = p.tag;
        this.offset = p.uint32;
        this.compLength = p.uint32;
        this.origLength = p.uint32;
        this.origChecksum = p.uint32;
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
function buildWoffLazyLookups(woff, dataview, createTable) {
    woff.tables = {};
    woff.directory.forEach(entry => {
        lazy(woff.tables, entry.tag.trim(), () => {
                let offset = 0;
                let view = dataview;
                // compressed data?
                if (entry.compLength !== entry.origLength) {
                    const unpacked = gzipDecode(new Uint8Array(dataview.buffer.slice(entry.offset, entry.offset + entry.compLength)));
                    view = new DataView(unpacked.buffer); }
                // uncompressed data.
                else { offset = entry.offset; }
                return createTable(woff.tables, { tag: entry.tag, offset, length: entry.origLength }, view);
        });
    });
}

export { WOFF };
