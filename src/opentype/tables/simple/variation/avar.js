import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `avar` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/avar
 */
class avar extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
    this.majorVersion = p.uint16;
    this.minorVersion = p.uint16;
    p.uint16;
    this.axisCount = p.uint16;
    this.axisSegmentMaps = [...new Array(this.axisCount)].map(
      (_) => new SegmentMap(p)
    );
  }
}

class SegmentMap {
  constructor(p) {
    this.positionMapCount = p.uint16;
    this.axisValueMaps = [...new Array(this.positionMapCount)].map(
      (_) => new AxisValueMap(p)
    );
  }
}

class AxisValueMap {
  constructor(p) {
    this.fromCoordinate = p.F2DOT14;
    this.toCoordinate = p.F2DOT14;
  }
}

export { avar };
