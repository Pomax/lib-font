class ItemVariationStoreTable {
  constructor(table, p) {
    this.table = table;
    this.parser = p;
    this.start = p.currentPosition;

    this.format = p.uint16;
    this.variationRegionListOffset = p.Offset32;
    this.itemVariationDataCount = p.uint16;
    this.itemVariationDataOffsets = [
      ...new Array(this.itemVariationDataCount),
    ].map((_) => p.Offset32);
  }
}

class ItemVariationData {
  constructor(p) {
    this.itemCount = p.uint16;
    this.shortDeltaCount = p.uint16;
    this.regionIndexCount = p.uint16;
    this.regionIndexes = p.uint16;
    this.deltaSets = [...new Array(this.itemCount)].map(
      (_) => new DeltaSet(p, this.shortDeltaCount, this.regionIndexCount)
    );
  }
}

class DeltaSet {
  constructor(p, shortDeltaCount, regionIndexCount) {
    // the documentation here seems problematic:
    //
    // "Logically, each DeltaSet record has regionIndexCount number of elements.
    //  The first shortDeltaCount elements are represented as signed 16-bit values
    //  (int16), and the remaining regionIndexCount - shortDeltaCount elements are
    //  represented as signed 8-bit values (int8). The length of the data for each
    //  row is shortDeltaCount + regionIndexCount."
    //
    // I'm assuming that should be "the remaining regionIndexCount elements are".
    this.DeltaData = [];
    while (shortDeltaCount-- > 0) {
      this.DeltaData.push(p.in16);
    }
    while (regionIndexCount-- > 0) {
      this.DeltaData.push(p.int8);
    }
  }
}

export { ItemVariationStoreTable };
