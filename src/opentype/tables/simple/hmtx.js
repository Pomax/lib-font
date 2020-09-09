import { SimpleTable } from "../simple-table.js";
import lazy from "../../../lazy.js";

/**
 * The OpenType `hmtx` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/hmtx
 */
class hmtx extends SimpleTable {
  constructor(dict, dataview, tables) {
    const { p } = super(dict, dataview);

    const numberOfHMetrics = tables.hhea.numberOfHMetrics;
    const numGlyphs = tables.maxp.numGlyphs;

    const metricsStart = p.currentPosition;
    lazy(this, `hMetrics`, () => {
      p.currentPosition = metricsStart;
      return [...new Array(numberOfHMetrics)].map(
        (_) => new LongHorMetric(p.uint16, p.int16)
      );
    });

    if (numberOfHMetrics < numGlyphs) {
      const lsbStart = metricsStart + numberOfHMetrics * 4;
      lazy(this, `leftSideBearings`, () => {
        p.currentPosition = lsbStart;
        return [...new Array(numGlyphs - numberOfHMetrics)].map((_) => p.int16);
      });
    }
  }
}

class LongHorMetric {
  constructor(w, b) {
    this.advanceWidth = w;
    this.lsb = b;
  }
}

export { hmtx };
