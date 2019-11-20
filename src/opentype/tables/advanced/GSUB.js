import { CommonLayoutTable } from "../common-layout-table.js";

class GSUB extends CommonLayoutTable {
    constructor(dict, dataview) {
        super(`GSUB`, dict, dataview);
    }
}

export { GSUB };