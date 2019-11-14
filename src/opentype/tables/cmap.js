import { Parser } from "../../parser.js";
import lazy from "../../lazy.js";
import createSubTable from "./cmap/createSubTable.js";

/**
 * The OpenType `cmap` main table.
 *
 * Subtables are found in the ./cmap directory
 */
class cmap {
    constructor(dict, dataview) {
        const p = new Parser(`fvar2`, dict, dataview);
        this.version = p.uint16;
        this.numTables = p.uint16;

        const getter = () => [...new Array(this.numTables)].map(_ => new EncodingRecord(p));
        lazy(this, `encodingRecords`, getter);

        // cache these values for use in `.get(nameID)`
        this.start = dict.offset;
        this.data = dataview;
    }

    get(tableID) {
        let record = this.encodingRecords[tableID];
        if (record) {
            const dict = { offset: this.start + record.offset };
            const p = new Parser(`Cmap subtable record ${tableID}`, dict, this.data);
            const format = p.uint16;
            return createSubTable(format, p);
        }
    }
}

/**
 * ...docs go here...
 */
class EncodingRecord {
    constructor(p) {
        this.platformID = p.uint16;
        this.encodingID = p.uint16;
        this.offset = p.offset32;
    }
}

export { cmap };
