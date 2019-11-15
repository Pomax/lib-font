import { GSTAR } from "./gstar.js";

class GPOS extends GSTAR {
    constructor(dict, dataview) {
        super(`GPOS`, dict, dataview);
    }
}

export { GPOS };