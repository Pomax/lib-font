import { Parser } from "../parser.js";
import createTable from "./createTable.js";

const gzipDecode = (window.pako ? window.pako.inflate : undefined);

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
function buildWoffLazyLookups(woff, dataview) {
    woff.tables = {};
    woff.directory.forEach(entry => {
        let table = false;

        Object.defineProperty(woff.tables, entry.tag.trim(), {
            get: () => {
                if (table) return table;
                let offset = 0;
                let view = dataview;
                // compressed data?
                if (entry.compLength !== entry.origLength) {
                    const unpacked = gzipDecode(new Uint8Array(dataview.buffer.slice(entry.offset, entry.offset + entry.compLength)));
                    view = new DataView(unpacked.buffer); }
                // uncompressed data.
                else { offset = entry.offset; }
                table = createTable(woff.tables, { tag: entry.tag, offset, length: entry.origLength }, view);
                return table;
            }
        });
    });
}

/**
 * ...
 */
class WoffTableDirectoryEntry {
    constructor(dataview, offset) {
        const p = new Parser("woff", { offset, length: 20 }, dataview);
        this.tag = p.tag;
        this.offset = p.uint32;
        this.compLength = p.uint32;
        this.origLength = p.uint32;
        this.origChecksum = p.uint32;
        p.verifyLength();
    }
}

/**
 * The WOFF header
 * See https://www.w3.org/TR/WOFF for more information
 */
class WOFF {
    constructor(dataview) {
        const p = new Parser("woff", { offset: 0, length: 44 }, dataview);
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

        // parse the dictionary
        let dictOffset = p.currentPosition;
        this.directory = [... new Array(this.numTables)].map((_,i) =>
            new WoffTableDirectoryEntry(dataview, dictOffset + i * 20)
        );

        buildWoffLazyLookups(this, dataview);
    }
}

export { WOFF };
