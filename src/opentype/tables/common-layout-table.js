import { SimpleTable } from "./simple-table.js";
import { ScriptList, ScriptTable, LangSysTable } from "./advanced/shared/script.js";
import { FeatureList, FeatureTable } from "./advanced/shared/feature.js";
import { LookupList, LookupTable } from "./advanced/shared/lookup.js";
import lazy from "../../lazy.js";


/**
* The table layout used by both GSUB and GPOS
*
* See https://docs.microsoft.com/en-us/typography/opentype/spec/GSUB
* See https://docs.microsoft.com/en-us/typography/opentype/spec/GPOS
*/
class CommonLayoutTable extends SimpleTable {
    constructor(name, dict, dataview) {
        const { p, tableStart } = super(name, dict, dataview);

        this.majorVersion = p.uint16;
        this.minorVersion = p.uint16;
        this.scriptListOffset = p.offset16;
        this.featureListOffset = p.offset16;
        this.lookupListOffset = p.offset16;

        if (this.majorVersion === 1 && this.minorVersion === 1) {
            this.featureVariationsOffset = p.offset32;
        }

        lazy(this, `scriptList`, () => {
            p.currentPosition = tableStart + this.scriptListOffset;
            return new ScriptList(p);
        });

        lazy(this, `featureList`, () => {
            p.currentPosition = tableStart + this.featureListOffset;
            return new FeatureList(p);
        });

        lazy(this, `lookupList`, () => {
            p.currentPosition = tableStart + this.lookupListOffset;
            return new LookupList(p);
        });

        if (this.featureVariationsOffset) {
            lazy(this, `featureVariations`, () => {
                p.currentPosition = tableStart + this.featureVariationsOffset;
                return new FeatureVariations(p);
            });
        }
    }

    // Script functions

    getSupportedScripts() {
        return (this.scriptList).scriptRecords.map(r => r.scriptTag);
    }

    getScriptTable(scriptTag) {
        let record = this.scriptList.scriptRecords.find(r => r.scriptTag === scriptTag);
        this.parser.currentPosition = this.scriptList.start + record.scriptOffset;
        let table = new ScriptTable(this.parser);
        table.scriptTag = scriptTag;
        return table;
    }

    // LangSys functions

    ensureScriptTable(arg) {
        if (typeof arg === "string") {
            return this.getScriptTable(arg);
        }
        return arg;
    }

    getSupportedLangSys(scriptTable) {
        scriptTable = this.ensureScriptTable(scriptTable);
        return scriptTable.langSysRecords.map(l => l.langSysTag);
    }

    getLangSysTable(scriptTable, langSysTag) {
        scriptTable = this.ensureScriptTable(scriptTable);
        let record = (scriptTable.langSysRecords).find(l => l.langSysTag === langSysTag);
        this.parser.currentPosition = scriptTable.start + record.langSysOffset;
        let table = new LangSysTable(this.parser);
        table.langSysTag = langSysTag;
        return table;
    }

    // Feature functions

    getFeatures(langSysTable) {
        return (langSysTable.featureIndices).map(index => this.getFeature(index));
    }

    getFeature(featureIndex) {
        let record = this.featureList.featureRecords[featureIndex];
        this.parser.currentPosition = this.featureList.start + record.featureOffset;
        let table = new FeatureTable(this.parser);
        table.featureTag = record.featureTag;
        return table;
    }

    // Lookup functions

    getLookups(featureTable) {
        return (featureTable.lookupListIndices).map(index => this.getLookup(index));
    }

    getLookup(lookupIndex) {
        let lookupOffset = this.lookupList.lookups[lookupIndex];
        this.parser.currentPosition = this.lookupList.start + lookupOffset;
        return new LookupTable(this.parser);
    }
}

export { CommonLayoutTable };
