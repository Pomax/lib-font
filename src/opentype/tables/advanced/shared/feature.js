import { ParsedData } from "../../../../parser.js";

class FeatureList extends ParsedData {
  constructor(p) {
    super(p);
    this.featureCount = p.uint16;
    this.featureRecords = [...new Array(this.featureCount)].map(
      (_) => new FeatureRecord(p)
    );
  }
}

class FeatureRecord {
  constructor(p) {
    this.featureTag = p.tag;
    this.featureOffset = p.offset16; // Offset to Feature table, from beginning of FeatureList
  }
}

class FeatureTable extends ParsedData {
  constructor(p) {
    super(p);
    this.featureParams = p.offset16;
    this.lookupIndexCount = p.uint16;
    this.lookupListIndices = [...new Array(this.lookupIndexCount)].map(
      (_) => p.uint16
    );
    // this.featureTag is imparted by the parser
  }

  // In order to parse the feature parameters, if there are any, we need to know which
  // feature this is, which is determined by the FeatureRecord.featureTag string.
  getFeatureParams() {
    if (this.featureParams > 0) {
      const p = this.parser;
      p.currentPosition = this.start + this.featureParams;
      const tag = this.featureTag;
      if (tag === `size`) return new Size(p);
      if (tag.startsWith(`cc`)) return new CharacterVariant(p);
      if (tag.startsWith(`ss`)) return new StylisticSet(p);
    }
  }
}

class CharacterVariant {
  // See https://docs.microsoft.com/en-us/typography/opentype/spec/features_ae#tag-cv01--cv99
  constructor(p) {
    this.format = p.uint16;
    this.featUiLabelNameId = p.uint16;
    this.featUiTooltipTextNameId = p.uint16;
    this.sampleTextNameId = p.uint16;
    this.numNamedParameters = p.uint16;
    this.firstParamUiLabelNameId = p.uint16;
    this.charCount = p.uint16;
    this.character = [...new Array(this.charCount)].map((_) => p.uint24);
  }
}

class Size {
  // See https://docs.microsoft.com/en-us/typography/opentype/spec/features_pt#-tag-size
  constructor(p) {
    this.designSize = p.uint16;
    this.subfamilyIdentifier = p.uint16;
    this.subfamilyNameID = p.uint16;
    this.smallEnd = p.uint16;
    this.largeEnd = p.uint16;
  }
}

class StylisticSet {
  // See https://docs.microsoft.com/en-us/typography/opentype/spec/features_pt#-tag-ss01---ss20
  constructor(p) {
    this.version = p.uint16;
    this.UINameID = p.uint16;
  }
}

export { FeatureList, FeatureTable };
