import { ParsedData } from "../../../../../parser.js";
import {
  LookupType,
  undoCoverageOffsetParsing,
  SubstLookupRecord,
} from "./gsub-lookup.js";
import { CoverageTable } from "../../shared/coverage.js";

class LookupType5 extends LookupType {
  type = 5;
  constructor(p) {
    super(p);

    // There are three possible subtable formats

    if (this.format === 1) {
      this.subRuleSetCount = p.uint16;
      this.subRuleSetOffsets = [...new Array(this.subRuleSetCount)].map(
        (_) => p.Offset16
      );
    }

    if (this.format === 2) {
      this.classDefOffset = p.Offset16;
      this.subClassSetCount = p.uint16;
      this.subClassSetOffsets = [...new Array(this.subClassSetCount)].map(
        (_) => p.Offset16
      );
    }

    if (this.format === 3) {
      // undo the coverageOffset parsing, because this format uses an
      // entire *array* of coverage offsets instead, like 6.3
      undoCoverageOffsetParsing(this);

      this.glyphCount = p.uint16;
      this.substitutionCount = p.uint16;
      this.coverageOffsets = [...new Array(this.glyphCount)].map(
        (_) => p.Offset16
      );
      this.substLookupRecords = [...new Array(this.substitutionCount)].map(
        (_) => new SubstLookupRecord(p)
      );
    }
  }

  getSubRuleSet(index) {
    if (this.format !== 1)
      throw new Error(`lookup type 5.${this.format} has no subrule sets.`);
    let p = this.parser;
    p.currentPosition = this.start + this.subRuleSetOffsets[index];
    return new SubRuleSetTable(p);
  }

  getSubClassSet(index) {
    if (this.format !== 2)
      throw new Error(`lookup type 5.${this.format} has no subclass sets.`);
    let p = this.parser;
    p.currentPosition = this.start + this.subClassSetOffsets[index];
    return new SubClassSetTable(p);
  }

  getCoverageTable(index) {
    if (this.format !== 3 && !index) return super.getCoverageTable();

    if (!index)
      throw new Error(
        `lookup type 5.${this.format} requires an coverage table index.`
      );

    let p = this.parser;
    p.currentPosition = this.start + this.coverageOffsets[index];
    return new CoverageTable(p);
  }
}

// 5.1

class SubRuleSetTable extends ParsedData {
  constructor(p) {
    super(p);
    this.subRuleCount = p.uint16;
    this.subRuleOffsets = [...new Array(this.subRuleCount)].map(
      (_) => p.Offset16
    );
  }
  getSubRule(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.subRuleOffsets[index];
    return new SubRuleTable(p);
  }
}

class SubRuleTable {
  constructor(p) {
    this.glyphCount = p.uint16;
    this.substitutionCount = p.uint16;
    this.inputSequence = [...new Array(this.glyphCount - 1)].map(
      (_) => p.uint16
    );
    this.substLookupRecords = [...new Array(this.substitutionCount)].map(
      (_) => new SubstLookupRecord(p)
    );
  }
}

// 5.2

class SubClassSetTable extends ParsedData {
  constructor(p) {
    super(p);
    this.subClassRuleCount = p.uint16;
    this.subClassRuleOffsets = [...new Array(this.subClassRuleCount)].map(
      (_) => p.Offset16
    );
  }
  getSubClass(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.subClassRuleOffsets[index];
    return new SubClassRuleTable(p);
  }
}

class SubClassRuleTable extends SubRuleTable {
  constructor(p) {
    super(p);
  }
}

export { LookupType5 };
