import { ParsedData } from "../../../../../parser.js";
import { CoverageTable } from "../coverage.js";

class LookupType extends ParsedData {
  constructor(p) {
    super(p);
    this.substFormat = p.uint16;
    this.coverageOffset = p.offset16;
  }
  getCoverageTable() {
    let p = this.parser;
    p.currentPosition = this.start + this.coverageOffset;
    return new CoverageTable(p);
  }
}

class LookupType1 extends LookupType {
  constructor(p) {
    super(p);
    // console.log(`lookup type 1`);
    this.deltaGlyphID = p.int16;
  }
}

class LookupType2 extends LookupType {
  constructor(p) {
    super(p);
    // console.log(`lookup type 2`);
    this.sequenceCount = p.uint16;
    this.sequenceOffsets = [...new Array(this.sequenceCount)].map(
      (_) => p.offset16
    );
  }
  getSequence(index) {
    // FIXME: make this a lazy .sequences array instead?
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

class LookupType3 extends LookupType {
  constructor(p) {
    super(p);
    // console.log(`lookup type 3`);
    this.alternateSetCount = p.uint16;
    this.alternateSetOffsets = [...new Array(this.alternateSetCount)].map(
      (_) => p.offset16
    );
  }
  getAlternateSet(index) {
    // FIXME: make this a lazy .alternateSets array instead?
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

class LookupType4 extends LookupType {
  constructor(p) {
    super(p);
    // console.log(`lookup type 4`);

    this.ligatureSetCount = p.uint16;
    this.ligatureSetOffsets = [...new Array(this.ligatureSetCount)].map(
      (_) => p.offset16
    ); // from beginning of subtable
  }
  getLigatureSet(index) {
    // FIXME: make this a lazy .ligatureSets array instead?
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
      (_) => p.offset16
    ); // from beginning of LigatureSetTable
  }
  getLigature(index) {
    // FIXME: make this a lazy .ligatures array instead?
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

// used by types 5 through 8
class SubstLookupRecord {
  constructor(p) {
    this.glyphSequenceIndex = p.uint16; // Index into current glyph sequence — first glyph = 0.
    this.lookupListIndex = p.uint16; // Lookup to apply to that position — zero-based index.
  }
}

class LookupType5 extends LookupType {
  constructor(p) {
    super(p);
    // console.log(`lookup type 5`);

    if (this.substFormat === 1) {
      this.subRuleSetCount = p.uint16;
      this.subRuleSetOffsets = [...new Array(this.subRuleSetCount)].map(
        (_) => p.offset16
      ); //
    }

    if (this.substFormat === 2) {
      this.classDefOffset = p.offset16;
      this.subClassSetCount = p.uint16;
      this.subClassSetOffsets = [...new Array(this.subClassSetCount)].map(
        (_) => p.offset16
      );
    }

    if (this.substFormat === 3) {
      // undo the coverageOffset parsing, because this format uses an
      // entire *array* of coverage offsets O_O
      p.currentPosition -= 2;
      delete this.coverageOffset;

      this.glyphCount = p.uint16;
      this.substitutionCount = p.uint16;
      this.coverageOffsets = [...new Array(this.glyphCount)].map(
        (_) => p.offset16
      );
      this.substLookupRecords = [...new Array(this.substitutionCount)].map(
        (_) => new SubstLookupRecord(p)
      );
    }
  }

  // FIXME: make these lazy props instead?

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
    return new SubRuleSetTable(p);
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

class SubRuleSetTable extends ParsedData {
  constructor(p) {
    this.subRuleCount = p.uint16;
    this.subRuleOffsets = [...new Array(this.subRuleCount)].map(
      (_) => p.offset16
    );
  }
  getSubRule(index) {
    // FIXME: make this a lazy .subrules array instead?
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

class SubClassSetTable extends ParsedData {
  constructor(p) {
    this.subClassRuleCount = p.uint16;
    this.subClassRuleOffsets = [...new Array(this.subClassRuleCount)].map(
      (_) => p.offset16
    );
  }
  getSubClass(index) {
    // FIXME: make this a lazy .subclasses array instead?
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

class LookupType6 extends LookupType {
  constructor(p) {
    super(p);
    console.log(`lookup type 6`);
    // TODO: implement
  }
}

class LookupType7 extends LookupType {
  constructor(p) {
    super(p);
    console.log(`lookup type 7`);
    // TODO: implement
  }
}

class LookupType8 extends LookupType {
  constructor(p) {
    super(p);
    console.log(`lookup type 8`);
    // TODO: implement
  }
}

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
