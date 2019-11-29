import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `meta` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/meta
*/
class meta extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);

        this.version = p.uint32;
        this.flags = p.uint32;
        p.uint32;
        this.dataMapsCount = p.uint32;

        this.dataMaps = [...new Array(this.dataMapsCount)].map(_ => new DataMap(this.tableStart, p));
    }
}

class DataMap {
    constructor(tableStart, p) {
        this.tableStart = tableStart;
        this.parser = p;

        this.tag = p.tag;
        this.dataOffset = p.offset32; // from the beginning of the metadata table to the data for this tag.
        this.dataLength = p.uint32;
    }

    getData() {
        // If you need this data, you're on the hook for parsing it properly.
        this.parser.currentField = this.tableStart + this.dataOffset;
        return this.parser.readBytes(this.dataLength);
    }
}

export { meta };
