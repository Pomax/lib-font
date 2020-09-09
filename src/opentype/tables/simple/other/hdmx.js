import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `hdmx` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/hdmx
 */
class hdmx extends SimpleTable {
  constructor(dict, dataview, tables) {
    const { p } = super(dict, dataview);
    const numGlyphs = tables.hmtx.numGlyphs;
    this.version = p.uint16;
    this.numRecords = p.int16;
    this.sizeDeviceRecord = p.int32;
    this.records = [...new Array(numRecords)].map(
      (_) => new DeviceRecord(p, numGlyphs)
    );
  }
}

class DeviceRecord {
  constructor(p, numGlyphs) {
    this.pixelSize = p.uint8;
    this.maxWidth = p.uint8;
    this.widths = p.readBytes(numGlyphs);
  }
}

export { hdmx };
