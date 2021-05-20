import { SimpleTable } from "./simple-table.js";
import {
  ScriptList,
  ScriptTable,
  LangSysTable,
} from "./advanced/shared/script.js";
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
  constructor(dict, dataview, name) {
    const { p, tableStart } = super(dict, dataview, name);

    this.majorVersion = p.uint16;
    this.minorVersion = p.uint16;
    this.scriptListOffset = p.Offset16;
    this.featureListOffset = p.Offset16;
    this.lookupListOffset = p.Offset16;

    if (this.majorVersion === 1 && this.minorVersion === 1) {
      this.featureVariationsOffset = p.Offset32;
    }

    const no_content = !(
      this.scriptListOffset ||
      this.featureListOffset ||
      this.lookupListOffset
    );

    lazy(this, `scriptList`, () => {
      if (no_content) return ScriptList.EMPTY;
      p.currentPosition = tableStart + this.scriptListOffset;
      return new ScriptList(p);
    });

    lazy(this, `featureList`, () => {
      if (no_content) return FeatureList.EMPTY;
      p.currentPosition = tableStart + this.featureListOffset;
      return new FeatureList(p);
    });

    lazy(this, `lookupList`, () => {
      if (no_content) return LookupList.EMPTY;
      p.currentPosition = tableStart + this.lookupListOffset;
      return new LookupList(p);
    });

    // FIXME: This class doesn't actually exist anywhere in the code...

    if (this.featureVariationsOffset) {
      lazy(this, `featureVariations`, () => {
        if (no_content) return FeatureVariations.EMPTY;
        p.currentPosition = tableStart + this.featureVariationsOffset;
        return new FeatureVariations(p);
      });
    }
  }

  // Script functions

  getSupportedScripts() {
    return this.scriptList.scriptRecords.map((r) => r.scriptTag);
  }

  getScriptTable(scriptTag) {
    let record = this.scriptList.scriptRecords.find(
      (r) => r.scriptTag === scriptTag
    );
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
    const hasDefault = scriptTable.defaultLangSys !== 0;
    const supported = scriptTable.langSysRecords.map((l) => l.langSysTag);
    if (hasDefault) supported.unshift(`dflt`);
    return supported;
  }

  getDefaultLangSysTable(scriptTable) {
    scriptTable = this.ensureScriptTable(scriptTable);
    let offset = scriptTable.defaultLangSys;
    if (offset !== 0) {
      this.parser.currentPosition = scriptTable.start + offset;
      let table = new LangSysTable(this.parser);
      table.langSysTag = ``;
      table.defaultForScript = scriptTable.scriptTag;
      return table;
    }
  }

  getLangSysTable(scriptTable, langSysTag = `dflt`) {
    if (langSysTag === `dflt`) return this.getDefaultLangSysTable(scriptTable);
    scriptTable = this.ensureScriptTable(scriptTable);
    let record = scriptTable.langSysRecords.find(
      (l) => l.langSysTag === langSysTag
    );
    this.parser.currentPosition = scriptTable.start + record.langSysOffset;
    let table = new LangSysTable(this.parser);
    table.langSysTag = langSysTag;
    return table;
  }

  // Feature functions

  getFeatures(langSysTable) {
    return langSysTable.featureIndices.map((index) => this.getFeature(index));
  }

  getFeature(indexOrTag) {
    let record;
    if (parseInt(indexOrTag) == indexOrTag) {
      record = this.featureList.featureRecords[indexOrTag];
    } else {
      record = this.featureList.featureRecords.find(
        (f) => f.featureTag === indexOrTag
      );
    }
    if (!record) return;
    this.parser.currentPosition = this.featureList.start + record.featureOffset;
    let table = new FeatureTable(this.parser);
    table.featureTag = record.featureTag;
    return table;
  }

  // Lookup functions

  getLookups(featureTable) {
    return featureTable.lookupListIndices.map((index) => this.getLookup(index));
  }

  getLookup(lookupIndex, type) {
    let lookupOffset = this.lookupList.lookups[lookupIndex];
    this.parser.currentPosition = this.lookupList.start + lookupOffset;
    return new LookupTable(this.parser, type);
  }
}

export { CommonLayoutTable };
