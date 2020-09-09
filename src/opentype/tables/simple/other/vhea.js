import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `vhea` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/vhea
 */
class vhea extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);

    this.version = p.fixed;
    // the next three fields are named as per version 1.0 and version 1.1
    this.ascent = this.vertTypoAscender = p.int16;
    this.descent = this.vertTypoDescender = p.int16;
    this.lineGap = this.vertTypoLineGap = p.int16;
    this.advanceHeightMax = p.int16;
    this.minTopSideBearing = p.int16;
    this.minBottomSideBearing = p.int16;
    this.yMaxExtent = p.int16;
    this.caretSlopeRise = p.int16;
    this.caretSlopeRun = p.int16;
    this.caretOffset = p.int16;
    this.reserved = p.int16;
    this.reserved = p.int16;
    this.reserved = p.int16;
    this.reserved = p.int16;
    this.metricDataFormat = p.int16;
    this.numOfLongVerMetrics = p.uint16;

    p.verifyLength();
  }
}

export { vhea };
