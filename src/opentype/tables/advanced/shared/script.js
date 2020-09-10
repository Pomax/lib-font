import { ParsedData } from "../../../../parser.js";

/**
 * ...
 */
class ScriptList extends ParsedData {
  static EMPTY = {
    scriptCount: 0,
    scriptRecords: []
  }

  constructor(p) {
    super(p);
    this.scriptCount = p.uint16;
    this.scriptRecords = [...new Array(this.scriptCount)].map(
      (_) => new ScriptRecord(p)
    );
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
class ScriptTable extends ParsedData {
  constructor(p) {
    super(p);
    this.defaultLangSys = p.offset16; // Offset to default LangSys table, from beginning of Script table — may be NULL
    this.langSysCount = p.uint16;
    this.langSysRecords = [...new Array(this.langSysCount)].map(
      (_) => new LangSysRecord(p)
    );
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
  constructor(p) {
    this.lookupOrder = p.offset16;
    this.requiredFeatureIndex = p.uint16;
    this.featureIndexCount = p.uint16;
    this.featureIndices = [...new Array(this.featureIndexCount)].map(
      (_) => p.uint16
    );
  }
}

export { ScriptList, ScriptTable, LangSysTable };
