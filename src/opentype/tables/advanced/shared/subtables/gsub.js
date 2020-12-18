import { ParsedData } from "../../../../../parser.js";
import { CoverageTable } from "../coverage.js";

class LookupType extends ParsedData {
  constructor(p) {
    super(p);
    this.substFormat = p.uint16;
    this.coverageOffset = p.Offset16;
  }
  getCoverageTable() {
    let p = this.parser;
    p.currentPosition = this.start + this.coverageOffset;
    return new CoverageTable(p);
  }
}

function undoCoverageOffsetParsing(instance) {
  instance.parser.currentPosition -= 2;
  delete instance.coverageOffset;
  delete instance.getCoverageTable;
}

// ===================================================================================

class LookupType1 extends LookupType {
  constructor(p) {
    super(p);
    this.deltaGlyphID = p.int16;
  }
}

// ===================================================================================

class LookupType2 extends LookupType {
  constructor(p) {
    super(p);
    this.sequenceCount = p.uint16;
    this.sequenceOffsets = [...new Array(this.sequenceCount)].map(
      (_) => p.Offset16
    );
  }
  getSequence(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.sequenceOffsets[index];
    return new SequenceTable(p);
  }
}

class SequenceTable {
  constructor(p) {
    this.glyphCount = p.uint16;
    this.substituteGlyphIDs = [...new Array(this.glyphCount)].map(
      (_) => p.uint16
    );
  }
}

// ===================================================================================

class LookupType3 extends LookupType {
  constructor(p) {
    super(p);
    this.alternateSetCount = p.uint16;
    this.alternateSetOffsets = [...new Array(this.alternateSetCount)].map(
      (_) => p.Offset16
    );
  }
  getAlternateSet(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.alternateSetOffsets[index];
    return new AlternateSetTable(p);
  }
}

class AlternateSetTable {
  constructor(p) {
    this.glyphCount = p.uint16;
    this.alternateGlyphIDs = [...new Array(this.glyphCount)].map(
      (_) => p.uint16
    );
  }
}

// ===================================================================================

class LookupType4 extends LookupType {
  constructor(p) {
    super(p);
    this.ligatureSetCount = p.uint16;
    this.ligatureSetOffsets = [...new Array(this.ligatureSetCount)].map(
      (_) => p.Offset16
    ); // from beginning of subtable
  }
  getLigatureSet(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.ligatureSetOffsets[index];
    return new LigatureSetTable(p);
  }
}

class LigatureSetTable extends ParsedData {
  constructor(p) {
    super(p);
    this.ligatureCount = p.uint16;
    this.ligatureOffsets = [...new Array(this.ligatureCount)].map(
      (_) => p.Offset16
    ); // from beginning of LigatureSetTable
  }
  getLigature(index) {
    let p = this.parser;
    p.currentPosition = this.start + this.ligatureOffsets[index];
    return new LigatureTable(p);
  }
}

class LigatureTable {
  constructor(p) {
    this.ligatureGlyph = p.uint16;
    this.componentCount = p.uint16;
    this.componentGlyphIDs = [...new Array(this.componentCount - 1)].map(
      (_) => p.uint16
    );
  }
}

// ===================================================================================

// used by types 5 through 8
class SubstLookupRecord {
  constructor(p) {
    this.glyphSequenceIndex = p.uint16; // Index into current glyph sequence — first glyph = 0.
    this.lookupListIndex = p.uint16; // Lookup to apply to that position — zero-based index.
  }
}

// ===================================================================================

class LookupType5 extends LookupType {
  constructor(p) {
    super(p);

    // There are three possible subtable formats

    if (this.substFormat === 1) {
      this.subRuleSetCount = p.uint16;
      this.subRuleSetOffsets = [...new Array(this.subRuleSetCount)].map(
        (_) => p.Offset16
      );
    }

    if (this.substFormat === 2) {
      this.classDefOffset = p.Offset16;
      this.subClassSetCount = p.uint16;
      this.subClassSetOffsets = [...new Array(this.subClassSetCount)].map(
        (_) => p.Offset16
      );
    }

    if (this.substFormat === 3) {
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
    if (this.substFormat !== 1)
      throw new Error(`lookup type 5.${this.substFormat} has no subrule sets.`);
    let p = this.parser;
    p.currentPosition = this.start + this.subRuleSetOffsets[index];
    return new SubRuleSetTable(p);
  }

  getSubClassSet(index) {
    if (this.substFormat !== 2)
      throw new Error(
        `lookup type 5.${this.substFormat} has no subclass sets.`
      );
    let p = this.parser;
    p.currentPosition = this.start + this.subClassSetOffsets[index];
    return new SubClassSetTable(p);
  }

  getCoverageTable(index) {
    if (this.substFormat !== 3 && !index) return super.getCoverageTable();

    if (!index)
      throw new Error(
        `lookup type 5.${this.substFormat} requires an coverage table index.`
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

// ===================================================================================

class LookupType6 extends LookupType {
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
    this.sequenceIndex = p.uint16;
    this.lookupListIndex = p.uint16;
  }
}

// ===================================================================================

class LookupType7 extends ParsedData {
  // note: not "extends LookupType"
  constructor(p) {
    super(p);
    this.substFormat = p.uint16;
    this.extensionLookupType = p.uint16;
    this.extensionOffset = p.Offset32;
  }
}

// ===================================================================================

class LookupType8 extends LookupType {
  constructor(p) {
    super(p);
    this.backtrackGlyphCount = p.uint16;
    this.backtrackCoverageOffsets = [
      ...new Array(this.backtrackGlyphCount),
    ].map((_) => p.Offset16);
    this.lookaheadGlyphCount = p.uint16;
    this.lookaheadCoverageOffsets = [new Array(this.lookaheadGlyphCount)].map(
      (_) => p.Offset16
    );
    this.glyphCount = p.uint16;
    this.substituteGlyphIDs = [...new Array(this.glyphCount)].map(
      (_) => p.uint16
    );
  }
}

// ===================================================================================

export default {
  buildSubtable: function (type, p) {
    switch (type) {
      case 1:
        return new LookupType1(p);
      case 2:
        return new LookupType2(p);
      case 3:
        return new LookupType3(p);
      case 4:
        return new LookupType4(p);
      case 5:
        return new LookupType5(p);
      case 6:
        return new LookupType6(p);
      case 7:
        return new LookupType7(p);
      case 8:
        return new LookupType8(p);
    }
  },
};
