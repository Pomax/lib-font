import { ParsedData } from "../../../../../../parser.js";
import { LookupType, undoCoverageOffsetParsing } from "./gsub.js";
import { CoverageTable } from "../../coverage.js";

export class LookupType6 extends LookupType {
  constructor(p) {
    super(p);

    // There are three possible subtable formats

    if (this.substFormat === 1) {
      this.chainSubRuleSetCount = p.uint16;
      this.chainSubRuleSetOffsets = [
        ...new Array(this.chainSubRuleSetCount),
      ].map((_) => p.Offset16);
    }

    if (this.substFormat === 2) {
      this.coverageOffset = p.Offset16;
      this.backtrackClassDefOffset = p.Offset16;
      this.inputClassDefOffset = p.Offset16;
      this.lookaheadClassDefOffset = p.Offset16;
      this.chainSubClassSetCount = p.uint16;
      this.chainSubClassSetOffsets = [
        ...new Array(this.chainSubClassSetCount),
      ].map((_) => p.Offset16);
    }

    if (this.substFormat === 3) {
      // undo the coverageOffset parsing, because this format uses an
      // entire *array* of coverage offsets instead, like 5.3
      undoCoverageOffsetParsing(this);

      this.backtrackGlyphCount = p.uint16;
      this.backtrackCoverageOffsets = [
        ...new Array(this.backtrackGlyphCount),
      ].map((_) => p.Offset16);
      this.inputGlyphCount = p.uint16;
      this.inputCoverageOffsets = [...new Array(this.inputGlyphCount)].map(
        (_) => p.Offset16
      );
      this.lookaheadGlyphCount = p.uint16;
      this.lookaheadCoverageOffsets = [
        ...new Array(this.lookaheadGlyphCount),
      ].map((_) => p.Offset16);
      this.seqLookupCount = p.uint16;
      this.seqLookupRecords = [...new Array(this.substitutionCount)].map(
        (_) => new SequenceLookupRecord(p)
      );
    }
  }

  getChainSubRuleSet(index) {
    if (this.substFormat !== 1)
      throw new Error(
        `lookup type 6.${this.substFormat} has no chainsubrule sets.`
      );
    let p = this.parser;
    p.currentPosition = this.start + this.chainSubRuleSetOffsets[index];
    return new ChainSubRuleSetTable(p);
  }

  getChainSubClassSet(index) {
    if (this.substFormat !== 2)
      throw new Error(
        `lookup type 6.${this.substFormat} has no chainsubclass sets.`
      );
    let p = this.parser;
    p.currentPosition = this.start + this.chainSubClassSetOffsets[index];
    return new ChainSubClassSetTable(p);
  }

  getCoverageFromOffset(offset) {
    if (this.substFormat !== 3)
      throw new Error(
        `lookup type 6.${this.substFormat} does not use contextual coverage offsets.`
      );
    let p = this.parser;
    p.currentPosition = this.start + offset;
    return new CoverageTable(p);
  }
}

// 6.1

class ChainSubRuleSetTable extends ParsedData {
  constructor(p) {
    super(p);
    this.chainSubRuleCount = p.uint16;
    this.chainSubRuleOffsets = [...new Array(this.chainSubRuleCount)].map(
      (_) => p.Offset16
    );
  }
  getSubRule(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.chainSubRuleOffsets[index];
    return new ChainSubRuleTable(p);
  }
}

class ChainSubRuleTable {
  constructor(p) {
    this.backtrackGlyphCount = p.uint16;
    this.backtrackSequence = [...new Array(this.backtrackGlyphCount)].map(
      (_) => p.uint16
    );
    this.inputGlyphCount = p.uint16;
    this.inputSequence = [...new Array(this.inputGlyphCount - 1)].map(
      (_) => p.uint16
    );
    this.lookaheadGlyphCount = p.uint16;
    this.lookAheadSequence = [...new Array(this.lookAheadGlyphCount)].map(
      (_) => p.uint16
    );
    this.substitutionCount = p.uint16;
    this.substLookupRecords = [...new Array(this.SubstCount)].map(
      (_) => new SubstLookupRecord(p)
    );
  }
}

// 6.2

class ChainSubClassSetTable extends ParsedData {
  constructor(p) {
    super(p);
    this.chainSubClassRuleCount = p.uint16;
    this.chainSubClassRuleOffsets = [
      ...new Array(this.chainSubClassRuleCount),
    ].map((_) => p.Offset16);
  }
  getSubClass(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.chainSubRuleOffsets[index];
    return new ChainSubClassRuleTable(p);
  }
}

class ChainSubClassRuleTable {
  constructor(p) {
    this.backtrackGlyphCount = p.uint16;
    this.backtrackSequence = [...new Array(this.backtrackGlyphCount)].map(
      (_) => p.uint16
    );
    this.inputGlyphCount = p.uint16;
    this.inputSequence = [...new Array(this.inputGlyphCount - 1)].map(
      (_) => p.uint16
    );
    this.lookaheadGlyphCount = p.uint16;
    this.lookAheadSequence = [...new Array(this.lookAheadGlyphCount)].map(
      (_) => p.uint16
    );
    this.substitutionCount = p.uint16;
    this.substLookupRecords = [...new Array(this.substitutionCount)].map(
      (_) => new SequenceLookupRecord(p)
    );
  }
}

// 6.3

class SequenceLookupRecord extends ParsedData {
  constructor(p) {
    super(p);
    this.sequenceIndex = p.uint16;
    this.lookupListIndex = p.uint16;
  }
}
