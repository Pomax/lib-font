import { ParsedData } from "../../../parser.js";
import { SimpleTable } from "../simple-table.js";
import { ClassDefinition } from "./shared/class.js";
import { CoverageTable } from "./shared/coverage.js";
import { ItemVariationStoreTable } from "./shared/itemvariation.js";
import lazy from "../../../lazy.js";

/**
 * The OpenType `GDEF` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/GDEF
 */
class GDEF extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);

    // there are three possible versions
    this.majorVersion = p.uint16;
    this.minorVersion = p.uint16;

    this.glyphClassDefOffset = p.offset16;
    lazy(this, `glyphClassDefs`, () => {
      if (this.glyphClassDefOffset === 0) return undefined;
      p.currentPosition = this.tableStart + this.glyphClassDefOffset;
      return new ClassDefinition(p);
    });

    this.attachListOffset = p.offset16;
    lazy(this, `attachList`, () => {
      if (this.attachListOffset === 0) return undefined;
      p.currentPosition = this.tableStart + this.attachListOffset;
      return new AttachList(p);
    });

    this.ligCaretListOffset = p.offset16;
    lazy(this, `ligCaretList`, () => {
      if (this.ligCaretListOffset === 0) return undefined;
      p.currentPosition = this.tableStart + this.ligCaretListOffset;
      return new LigCaretList(p);
    });

    this.markAttachClassDefOffset = p.offset16;
    lazy(this, `markAttachClassDef`, () => {
      if (this.markAttachClassDefOffset === 0) return undefined;
      p.currentPosition = this.tableStart + this.markAttachClassDefOffset;
      return new ClassDefinition(p);
    });

    if (this.minorVersion >= 2) {
      this.markGlyphSetsDefOffset = p.offset16;
      lazy(this, `markGlyphSetsDef`, () => {
        if (this.markGlyphSetsDefOffset === 0) return undefined;
        p.currentPosition = this.tableStart + this.markGlyphSetsDefOffset;
        return new MarkGlyphSetsTable(p);
      });
    }

    if (this.minorVersion === 3) {
      this.itemVarStoreOffset = p.offset32;
      lazy(this, `itemVarStore`, () => {
        if (this.itemVarStoreOffset === 0) return undefined;
        p.currentPosition = this.tableStart + this.itemVarStoreOffset;
        return new ItemVariationStoreTable(p);
      });
    }
  }
}

class AttachList extends ParsedData {
  constructor(p) {
    super(p);
    this.coverageOffset = p.offset16; // Offset to Coverage table - from beginning of AttachList table
    this.glyphCount = p.uint16;
    this.attachPointOffsets = [...new Array(this.glyphCount)].map(
      (_) => p.offset16
    ); // From beginning of AttachList table (in Coverage Index order)
  }
  getPoint(pointID) {
    this.parser.currentPosition = this.start + this.attachPointOffsets[pointID];
    return new AttachPoint(this.parser);
  }
}

class AttachPoint {
  constructor(p) {
    this.pointCount = p.uint16;
    this.pointIndices = [...new Array(this.pointCount)].map((_) => p.uint16);
  }
}

class LigCaretList extends ParsedData {
  constructor(p) {
    super(p);

    this.coverageOffset = p.offset16;

    lazy(this, `coverage`, () => {
      p.currentPosition = this.start + this.coverageOffset;
      return new CoverageTable(p);
    });

    this.ligGlyphCount = p.uint16;
    this.ligGlyphOffsets = [...new Array(this.ligGlyphCount)].map(
      (_) => p.offset16
    ); // From beginning of LigCaretList table
  }

  getLigGlyph(ligGlyphID) {
    this.parser.currentPosition = this.start + this.ligGlyphOffsets[ligGlyphID];
    return new LigGlyph(this.parser);
  }
}

class LigGlyph extends ParsedData {
  constructor(p) {
    super(p);
    this.caretCount = p.uint16;
    this.caretValueOffsets = [...new Array(this.caretCount)].map(
      (_) => p.offset16
    ); // From beginning of LigGlyph table
  }

  getCaretValue(caretID) {
    this.parser.currentPosition = this.start + this.caretValueOffsets[caretID];
    return new CaretValue(this.parser);
  }
}

class CaretValue {
  constructor(p) {
    this.caretValueFormat = p.uint16;

    if (this.caretValueFormat === 1) {
      this.coordinate = p.int16;
    }

    if (this.caretValueFormat === 2) {
      this.caretValuePointIndex = p.uint16;
    }

    if (this.caretValueFormat === 3) {
      this.coordinate = p.int16;
      this.deviceOffset = p.offset16; // Offset to Device table (non-variable font) / Variation Index table (variable font) for X or Y value-from beginning of CaretValue table
    }
  }
}

class MarkGlyphSetsTable extends ParsedData {
  constructor(p) {
    super(p);

    this.markGlyphSetTableFormat = p.uint16;
    this.markGlyphSetCount = p.uint16;
    this.coverageOffsets = [...new Array(this.markGlyphSetCount)].map(
      (_) => p.offset32
    );
  }

  getMarkGlyphSet(markGlyphSetID) {
    this.parser.currentPosition =
      this.start + this.coverageOffsets[markGlyphSetID];
    return new CoverageTable(this.parser);
  }
}

export { GDEF };
