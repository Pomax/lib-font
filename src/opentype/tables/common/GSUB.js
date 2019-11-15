import { GSTAR } from "./gstar.js";

class GSUB extends GSTAR {
    constructor(dict, dataview) {
        super(`GSUB`, dict, dataview);
    }
}

export { GSUB };