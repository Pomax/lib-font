import { ParsedData } from "../../../../parser.js";
import { FeatureTable } from "./feature.js";
import lazy from "../../../../lazy.js";

class FeatureVariations extends ParsedData {
  // See https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#featurevariations-table
  static EMPTY = {
    featureVariationRecordCount: 0,
    featureVariationRecords: [],
  };

  constructor(p) {
    super(p);
    this.majorVersion = p.uint16;
    this.minorVersion = p.uint16;
    this.featureVariationRecordCount = p.uint32;
    this.featureVariationRecords = [
      ...new Array(this.featureVariationRecordCount),
    ].map((_) => new FeatureVariationRecord(this.start, p));
  }
}

class FeatureVariationRecord {
  constructor(featureVariationsStart, p) {
    this.conditionSetOffset = p.Offset32; // Offset to ConditionSet table, from beginning of FeatureVariations table, may be NULL
    this.featureTableSubstitutionOffset = p.Offset32; // Offset to FeatureTableSubstitution table, from beginning of FeatureVariations table, may be NULL

    lazy(this, `conditionSet`, () => {
      if (this.conditionSetOffset === 0) return undefined;
      p.currentPosition = featureVariationsStart + this.conditionSetOffset;
      return new ConditionSet(p);
    });

    lazy(this, `featureTableSubstitution`, () => {
      if (this.featureTableSubstitutionOffset === 0) return undefined;
      p.currentPosition =
        featureVariationsStart + this.featureTableSubstitutionOffset;
      return new FeatureTableSubstitution(p);
    });
  }
}

class ConditionSet extends ParsedData {
  constructor(p) {
    super(p);
    this.conditionCount = p.uint16;
    this.conditionOffsets = [...new Array(this.conditionCount)].map(
      (_) => p.Offset32
    );
    // Array of offsets to Condition tables, from beginning of ConditionSet table
  }

  getCondition(index) {
    this.parser.currentPosition = this.start + this.conditionOffsets[index];
    return new ConditionTable(this.parser);
  }
}

class ConditionTable {
  constructor(p) {
    this.format = p.uint16;

    // Format 1 is currently the only defined format. Unrecognized formats
    // should fail to match, but must not fail to parse.
    if (this.format === 1) {
      this.axisIndex = p.uint16;
      this.filterRangeMinValue = p.F2DOT14;
      this.filterRangeMaxValue = p.F2DOT14;
    }
  }
}

class FeatureTableSubstitution extends ParsedData {
  constructor(p) {
    super(p);
    this.majorVersion = p.uint16;
    this.minorVersion = p.uint16;
    this.substitutionCount = p.uint16;
    this.substitutions = [...new Array(this.substitutionCount)].map(
      (_) => new FeatureTableSubstitutionRecord(p)
    );
  }

  getAlternateFeature(index) {
    const record = this.substitutions[index];
    this.parser.currentPosition = this.start + record.alternateFeatureOffset;
    return new FeatureTable(this.parser);
  }
}

class FeatureTableSubstitutionRecord {
  constructor(p) {
    this.featureIndex = p.uint16;
    this.alternateFeatureOffset = p.Offset32; // Offset to alternate Feature table, from beginning of FeatureTableSubstitution table
  }
}

export { FeatureVariations };
