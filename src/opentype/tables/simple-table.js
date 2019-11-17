import { Parser, ParsedData } from "../../parser.js";

class SimpleTable extends ParsedData{
    constructor(name, dict, dataview) {
        const { parser, start } = super(new Parser(name, dict, dataview));

        // alias the parser as "p"
        const pGetter = { enumerable: false, get:() => parser };
        Object.defineProperty(this, `p`, pGetter);

        // alias the start offset as "tableStart"
        const startGetter = { enumerable: false, get:() => start };
        Object.defineProperty(this, `tableStart`, startGetter);
    }
}

export { SimpleTable };
