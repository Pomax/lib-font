import { ParsedData } from "../../../../parser.js";

class FeatureList extends ParsedData {
    constructor(p) {
        super(p);
        this.featureCount = p.uint16;
        this.featureRecords = [...new Array(this.featureCount)].map(_ => new FeatureRecord(p));
    }
}

class FeatureRecord {
    constructor(p) {
        this.featureTag = p.tag;
        this.featureOffset = p.offset16 // Offset to Feature table, from beginning of FeatureList
    }
}

class FeatureTable {
    constructor(p) {
        this.featureParams = p.offset16;
        this.lookupIndexCount = p.uint16;
        this.lookupListIndices = [...new Array(this.lookupIndexCount)].map(_ => p.uint16);
    }
}

export { FeatureList, FeatureTable };
