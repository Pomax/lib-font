/**
 * ...
 */
class ScriptList {
    constructor(table, p) {
        this.table = table;
        this.parser = p;
        this.start = p.currentPosition;

        this.scriptCount = p.uint16;
        this.scriptRecords = [...new Array(this.scriptCount)].map(_ => new ScriptRecord(p));
    }

    getSupportedScripts() {
        return this.scriptRecords.map(r => r.scriptTag);
    }

    getTable(script) {
        let record = (this.scriptRecords).find(r => r.scriptTag === script);
        this.parser.currentPosition = this.start + record.scriptOffset;
        let table = new ScriptTable(this.table, this.parser);
        return table;
    }
}

/**
 * ...
 */
class ScriptRecord {
    constructor(p) {
        this.scriptTag = p.tag;
        this.scriptOffset = p.offset16; // Offset to Script table, from beginning of ScriptList
    }
}

/**
 * ...
 */
class ScriptTable {
    constructor(table, p) {
        this.table = table;
        this.parser = p;
        this.start = p.currentPosition;

        this.defaultLangSys = p.offset16; // Offset to default LangSys table, from beginning of Script table — may be NULL
        this.langSysCount = p.uint16;
        this.langSysRecords = [...new Array(this.langSysCount)].map(_ => new LangSysRecord(p));
    }

    getSupportedLangSys() {
        return this.langSysRecords.map(l => l.langSysTag);
    }

    getLangSys(langSys) {
        let record = (this.langSysRecords).find(l => l.langSysTag === langSys);
        this.parser.currentPosition = this.start + record.langSysOffset;
        let table = new LangSysTable(this.table, this.parser);
        return table;
    }
}

/**
 * ...
 */
class LangSysRecord {
    constructor(p) {
        this.langSysTag = p.tag;
        this.langSysOffset = p.offset16; // Offset to LangSys table, from beginning of Script table
    }
}

/**
 * ...
 */
class LangSysTable {
    constructor(table, p) {
        this.table = table;

        this.lookupOrder = p.offset16;
        this.requiredFeatureIndex = p.uint16;
        this.featureIndexCount = p.uint16
        this.featureIndices = [...new Array(this.featureIndexCount)].map(_ => p.uint16);
    }

    getFeature(feature) {
        const features = this.getFeatures();
        return features.find(f => f.featureTag === feature);
    }

    getFeatures() {
        return (this.featureIndices).map(index => this.table.featureList.getFeature(index));
    }
}

export { ScriptList };
