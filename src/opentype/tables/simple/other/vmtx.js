import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `vmtx` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/vmtx
 *
 * The overall structure of the vertical metrics table consists of two arrays:
 * a vMetrics array, followed by an array of top side bearings.
 *
 */
class vmtx extends SimpleTable {
  constructor(dict, dataview, tables) {
    super(dict, dataview);
    const numOfLongVerMetrics = tables.vhea.numOfLongVerMetrics;
    const numGlyphs = tables.maxp.numGlyphs;

    const metricsStart = p.currentPosition;
    lazy(this, `vMetrics`, () => {
      p.currentPosition = metricsStart;
      return [...new Array(numOfLongVerMetrics)].map(
        (_) => new LongVertMetric(p.uint16, p.int16)
      );
    });

    if (numOfLongVerMetrics < numGlyphs) {
      const tsbStart = metricsStart + numOfLongVerMetrics * 4;
      lazy(this, `topSideBearings`, () => {
        p.currentPosition = tsbStart;
        return [...new Array(numGlyphs - numOfLongVerMetrics)].map(
          (_) => p.int16
        );
      });
    }
  }
}

class LongVertMetric {
  constructor(h, b) {
    this.advanceHeight = h;
    this.topSideBearing = b;
  }
}

export { vmtx };
