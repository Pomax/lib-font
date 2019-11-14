import { Parser } from "./parser.js";
import createTable from "./createTable.js";

/**
 * SFNT directory Table Record struct.
 */
class TableRecord {
    constructor(dataview, offset) {
        const p = new Parser("table record", { offset }, dataview);
        this.tag = p.tag;
        this.checksum = p.uint32;
        this.offset = p.uint32;
        this.length = p.uint32;
    }
}

/**
 * the SFNT header.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/overview for more information
 */
class SFNT {
    constructor(dataview) {
        const p = new Parser("sfnt", { offset: 0 }, dataview);
        this.version = p.uint32;
        this.numTables = p.uint16;
        this.searchRange = p.uint16;
        this.entrySelector = p.uint16;
        this.rangeShift = p.uint16;

        // parse the dictionary
        const dictOffset = 12;
        this.directory = [... new Array(this.numTables)].map((_,i) =>
            new TableRecord(dataview, dictOffset + i * 16)
        );

        // add convenience bindings for each table, with lazy loading
        this.tables = {};
        this.directory.forEach(entry => {
            let table = false;
            Object.defineProperty(this.tables, entry.tag.trim(), {
                get: () => {
                    if (table) return table;
                    table = createTable({
                        tag: entry.tag,
                        offset: entry.offset,
                        length: entry.length
                    }, dataview);
                    return table;
                }
            });
        });
    }
}

export { SFNT }
