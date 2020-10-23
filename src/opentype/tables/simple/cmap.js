import { SimpleTable } from "../simple-table.js";
import createSubTable from "./cmap/createSubTable.js";
import lazy from "../../../lazy.js";

/**
 * The OpenType `cmap` main table.
 *
 * Subtables are found in the ./cmap directory
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/cmap for more information
 */
class cmap extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
    this.version = p.uint16;
    this.numTables = p.uint16;
    this.encodingRecords = [...new Array(this.numTables)].map(
      (_) => new EncodingRecord(p, this.tableStart)
    );
  }

  getSubTable(tableID) {
    return this.encodingRecords[tableID].table;
  }

  getSupportedEncodings() {
    return this.encodingRecords.map((r) => ({
      platformID: r.platformID,
      encodingId: r.encodingID,
    }));
  }

  getSupportedCharCodes(platformID, encodingID) {
    const recordID = this.encodingRecords.findIndex(
      (r) => r.platformID === platformID && r.encodingID === encodingID
    );
    if (recordID === -1) return false;
    const subtable = this.getSubTable(recordID);
    return subtable.getSupportedCharCodes();
  }

  reverse(glyphid) {
    for (let i = 0; i < this.numTables; i++) {
      let code = this.getSubTable(i).reverse(glyphid);
      if (code) return code;
    }
  }

  getGlyphId(char) {
    let last = 0;
    this.encodingRecords.some((_, tableID) => {
      let t = this.getSubTable(tableID);
      if (!t.getGlyphId) return false;
      last = t.getGlyphId(char);
      return last !== 0;
    });
    return last;
  }

  supports(char) {
    return this.encodingRecords.some((_, tableID) => {
      const t = this.getSubTable(tableID);
      return t.supports && t.supports(char) !== false;
    });
  }

  supportsVariation(variation) {
    return this.encodingRecords.some((_, tableID) => {
      const t = this.getSubTable(tableID);
      return t.supportsVariation && t.supportsVariation(variation) !== false;
    });
  }
}

/**
 * ...docs go here...
 */
class EncodingRecord {
  constructor(p, tableStart) {
    const platformID = (this.platformID = p.uint16);
    const encodingID = (this.encodingID = p.uint16);
    const offset = (this.offset = p.Offset32); // from cmap table start

    lazy(this, `table`, () => {
      p.currentPosition = tableStart + offset;
      return createSubTable(p, platformID, encodingID);
    });
  }
}

export { cmap };
