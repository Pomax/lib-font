import { CommonLayoutTable } from "../common-layout-table.js";

class GPOS extends CommonLayoutTable {
  constructor(dict, dataview) {
    super(dict, dataview, `GPOS`);
  }
  getLookup(lookupIndex) {
    return super.getLookup(lookupIndex, `GPOS`);
  }
}

export { GPOS };
