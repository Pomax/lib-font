import { SimpleTable } from "../simple-table.js";

/**
 * The OpenType `head` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/head
 */
class head extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
    this.load({
      majorVersion: p.uint16,
      minorVersion: p.uint16,
      fontRevision: p.fixed,
      checkSumAdjustment: p.uint32,
      magicNumber: p.uint32,
      flags: p.flags(16),
      unitsPerEm: p.uint16,
      created: p.longdatetime,
      modified: p.longdatetime,
      xMin: p.int16,
      yMin: p.int16,
      xMax: p.int16,
      yMax: p.int16,
      macStyle: p.flags(16),
      lowestRecPPEM: p.uint16,
      fontDirectionHint: p.uint16,
      indexToLocFormat: p.uint16,
      glyphDataFormat: p.uint16,
    });
  }
}

export { head };
