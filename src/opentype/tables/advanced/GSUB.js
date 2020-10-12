import { CommonLayoutTable } from "../common-layout-table.js";

class GSUB extends CommonLayoutTable {
  constructor(dict, dataview) {
    super(dict, dataview);
  }

  getLookup(lookupIndex) {
    return super.getLookup(lookupIndex, `GSUB`);
  }
}

export { GSUB };
