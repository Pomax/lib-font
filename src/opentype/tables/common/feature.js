class FeatureList {
    constructor(table, p) {
        this.table = table;
        this.parser = p;
        this.start = p.currentPosition;

        this.featureCount = p.uint16;
        this.featureRecords = [...new Array(this.featureCount)].map(_ => new FeatureRecord(p));
    }

    getSupportedFeatures() {
        return (this.featureRecords).map(f => f.featureTag);
    }

    getFeature(featureIndex) {
        let record = this.featureRecords[featureIndex];
        this.parser.currentPosition = this.start + record.featureOffset;
        let table = new FeatureTable(this.table, this.parser);
        table.featureTag = record.featureTag;
        return table;
    }
}

class FeatureRecord {
    constructor(p) {
        this.featureTag = p.tag;
        this.featureOffset = p.offset16 // Offset to Feature table, from beginning of FeatureList
    }
}

class FeatureTable {
    constructor(table, p) {
        this.table = table;
        this.parser = p;

        this.featureParams = p.offset16;
        this.lookupIndexCount = p.uint16;
        this.lookupListIndices = [...new Array(this.lookupIndexCount)].map(_ => p.uint16);
    }

    getLookupList() {
        return (this.lookupListIndices).map(index => this.table.lookupList.getLookup(index));
    }
}

export { FeatureList, FeatureTable };
