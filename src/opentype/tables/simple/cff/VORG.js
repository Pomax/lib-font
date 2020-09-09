import { SimpleTable } from "../../simple-table.js";
import lazy from "../../../../lazy.js";

/**
 * The OpenType `VORG` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/VORG
 */
class VORG extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);

    this.majorVersion = p.uint16;
    this.minorVersion = p.uint16;
    this.defaultVertOriginY = p.int16;
    this.numVertOriginYMetrics = p.uint16;

    lazy(this, `vertORiginYMetrics`, () =>
      [...new Array(this.numVertOriginYMetrics)].map(
        (_) => new VertOriginYMetric(p)
      )
    );
  }
}

class VertOriginYMetric {
  constructor(p) {
    this.glyphIndex = p.uint16;
    this.vertOriginY = p.int16;
  }
}

export { VORG };
