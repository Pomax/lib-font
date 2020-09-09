import lazy from "../../../lazy.js";
import { SimpleTable } from "../simple-table.js";

/**
 * The OpenType `BASE` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/BASE
 */
class BASE extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);

    this.majorVersion = p.uint16;
    this.minorVersion = p.uint16;
    this.horizAxisOffset = p.offset16; // from beginning of BASE table
    this.vertAxisOffset = p.offset16; // from beginning of BASE table

    lazy(
      this,
      `horizAxis`,
      () =>
        new AxisTable({ offset: dict.offset + this.horizAxisOffset }, dataview)
    );
    lazy(
      this,
      `vertAxis`,
      () =>
        new AxisTable({ offset: dict.offset + this.vertAxisOffset }, dataview)
    );

    if (this.majorVersion === 1 && this.minorVersion === 1) {
      this.itemVarStoreOffset = p.offset32; // from beginning of BASE table
      lazy(
        this,
        `itemVarStore`,
        () =>
          new AxisTable(
            { offset: dict.offset + this.itemVarStoreOffset },
            dataview
          )
      );
    }
  }
}

/**
 * Axis table
 */
class AxisTable extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview, `AxisTable`);

    this.baseTagListOffset = p.offset16; // from beginning of Axis table
    this.baseScriptListOffset = p.offset16; // from beginning of Axis table

    lazy(
      this,
      `baseTagList`,
      () =>
        new BaseTagListTable(
          { offset: dict.offset + this.baseTagListOffset },
          dataview
        )
    );
    lazy(
      this,
      `baseScriptList`,
      () =>
        new BaseScriptListTable(
          { offset: dict.offset + this.baseScriptListOffset },
          dataview
        )
    );
  }
}

class BaseTagListTable extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview, `BaseTagListTable`);
    this.baseTagCount = p.uint16;
    // TODO: make lazy?
    this.baselineTags = [...new Array(this.baseTagCount)].map((_) => p.tag);
  }
}

class BaseScriptListTable extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview, `BaseScriptListTable`);
    this.baseScriptCount = p.uint16;

    const recordStart = p.currentPosition;
    lazy(this, `baseScriptRecords`, () => {
      p.currentPosition = recordStart;
      return [...new Array(this.baseScriptCount)].map(
        (_) => new BaseScriptRecord(this.start, p)
      );
    });
  }
}

class BaseScriptRecord {
  constructor(baseScriptListTableStart, p) {
    this.baseScriptTag = p.tag;
    this.baseScriptOffset = p.offset16; // from beginning of BaseScriptList
    lazy(this, `baseScriptTable`, () => {
      p.currentPosition = baseScriptListTableStart + this.baseScriptOffset;
      return new BaseScriptTable(p);
    });
  }
}

class BaseScriptTable {
  constructor(p) {
    this.start = p.currentPosition;
    this.baseValuesOffset = p.offset16; // from beginning of BaseScript table
    this.defaultMinMaxOffset = p.offset16; // from beginning of BaseScript table
    this.baseLangSysCount = p.uint16;
    this.baseLangSysRecords = [...new Array(this.baseLangSysCount)].map(
      (_) => new BaseLangSysRecord(this.start, p)
    );

    lazy(this, `baseValues`, () => {
      p.currentPosition = this.start + this.baseValuesOffset;
      return new BaseValuesTable(p);
    });

    lazy(this, `defaultMinMax`, () => {
      p.currentPosition = this.start + this.defaultMinMaxOffset;
      return new MinMaxTable(p);
    });
  }
}

class BaseLangSysRecord {
  constructor(baseScriptTableStart, p) {
    this.baseLangSysTag = p.tag;
    this.minMaxOffset = p.offset16; // from beginning of BaseScript table
    lazy(this, `minMax`, () => {
      p.currentPosition = baseScriptTableStart + this.minMaxOffset;
      return new MinMaxTable(p);
    });
  }
}

class BaseValuesTable {
  constructor(p) {
    this.parser = p;
    this.start = p.currentPosition;

    this.defaultBaselineIndex = p.uint16;
    this.baseCoordCount = p.uint16;
    this.baseCoords = [...new Array(this.baseCoordCount)].map(
      (_) => p.offset16
    );
  }
  getTable(id) {
    this.parser.currentPosition = this.start + this.baseCoords[id];
    return new BaseCoordTable(this.parser);
  }
}

class MinMaxTable {
  constructor(p) {
    this.minCoord = p.offset16;
    this.maxCoord = p.offset16;
    this.featMinMaxCount = p.uint16;

    const recordStart = p.currentPosition;
    lazy(this, `featMinMaxRecords`, () => {
      p.currentPosition = recordStart;
      return [...new Array(this.featMinMaxCount)].map(
        (_) => new FeatMinMaxRecord(p)
      );
    });
  }
}

class FeatMinMaxRecord {
  constructor(p) {
    this.featureTableTag = p.tag;
    this.minCoord = p.offset16;
    this.maxCoord = p.offset16;
  }
}

class BaseCoordTable {
  constructor(p) {
    this.baseCoordFormat = p.uint16;
    this.coordinate = p.int16;
    if (this.baseCoordFormat === 2) {
      this.referenceGlyph = p.uint16;
      this.baseCoordPoint = p.uint16;
    }
    if (this.baseCoordFormat === 3) {
      this.deviceTable = p.offset16;
    }
  }
}

export { BASE };
