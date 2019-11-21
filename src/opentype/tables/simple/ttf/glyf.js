import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `glyf` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/glyf
*/
class glyf extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
        // This table is not really a table, but a pure data block.
    }

    getGlyphData(offset, length) {
        this.parser.currentPosition = this.tableStart + offset;
        return this.parser.readBytes(length);
    }
}

export { glyf };
