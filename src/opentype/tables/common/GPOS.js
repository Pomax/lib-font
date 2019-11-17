import { CommonLayoutTable } from "../common-layout-table.js";

class GPOS extends CommonLayoutTable {
    constructor(dict, dataview) {
        super(`GPOS`, dict, dataview);
    }
}

export { GPOS };