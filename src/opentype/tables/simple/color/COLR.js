import { SimpleTable } from "../../simple-table.js";

/**
* The OpenType `COLR` table.
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/COLR
*/
class COLR extends SimpleTable {
    constructor(dict, dataview) {
        const { p } =  super(dict, dataview);
        this.version = p.uint16;
        this.numBaseGlyphRecords = p.uint16;
        this.baseGlyphRecordsOffset = p.Offset32; 	// from beginning of COLR table) to Base Glyph records.
        this.layerRecordsOffset = p.Offset32; // from beginning of COLR table) to Layer Records.
        this.numLayerRecords = p.uint16;
    }

    getBaseGlyphRecord(glyphID) {
        // the documentation recommends doing a binary search to find the record,
        // and so we shall. The size of a BaseGlyphRecord is 6 bytes, so off we go!
        let start = this.tableStart + this.baseGlyphRecordsOffset;
        this.parser.currentPosition = start;
        let first = new BaseGlyphRecord(this.parser);
        let firstID = first.gID;

        let end =  this.tableStart + this.layerRecordsOffset - 6;
        this.parser.currentPosition = end;
        let last = new BaseGlyphRecord(this.parser);
        let lastID = last.gID;

        // right. Onward, to victory!
        if (firstID === glyphID) return first;
        if (lastID === glyphID) return last;

        // delayed gratification!
        while(true) {
            if (start === end) break;
            let mid = start + (end - start) / 12;
            this.parser.currentPosition = mid;
            let middle = new BaseGlyphRecord(this.parser);
            let midID = middle.gID;
            
            if (midID === glyphID) return middle;

            // curses!
            else if (midID > glyphID) { end = mid; }
            else if (midID < glyphID) { start = mid; }
        }

        return false;
    }

    getLayers(glyphID) {
        let record = this.getBaseGlyphRecord(glyphID);
        this.parser.currentPosition = this.tableStart + this.layerRecordsOffset + 4 * record.firstLayerIndex;
        return [...new Array(record.numLayers)].map(_ => new LayerRecord(p));
    }
}

class BaseGlyphRecord {
    constructor(p) {
        this.gID = p.uint16
        this.firstLayerIndex = p.uint16
        this.numLayers = p.uint16
    }
}

class LayerRecord {
    constructor(p) {
        this.gID = p.uint16;
        this.paletteIndex = p.uint16;
    }
}

export { COLR };
