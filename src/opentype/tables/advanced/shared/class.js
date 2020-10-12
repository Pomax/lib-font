class ClassDefinition {
  constructor(p) {
    this.classFormat = p.uint16;

    if (this.classFormat === 1) {
      this.startGlyphID = p.uint16;
      this.glyphCount = p.uint16;
      this.classValueArray = [...new Array(this.glyphCount)].map(
        (_) => p.uint16
      );
    }

    if (this.classFormat === 2) {
      this.classRangeCount = p.uint16;
      this.classRangeRecords = [...new Array(this.classRangeCount)].map(
        (_) => new ClassRangeRecord(p)
      );
    }
  }
}

class ClassRangeRecord {
  constructor(p) {
    this.startGlyphID = p.uint16;
    this.endGlyphID = p.uint16;
    this.class = p.uint16;
  }
}

export { ClassDefinition };
