import { Parser, ParsedData } from "../../parser.js";

class SimpleTable extends ParsedData {
  constructor(dict, dataview, name) {
    const { parser, start } = super(new Parser(dict, dataview, name));

    // alias the parser as "p"
    const pGetter = { enumerable: false, get: () => parser };
    Object.defineProperty(this, `p`, pGetter);

    // alias the start offset as "tableStart"
    const startGetter = { enumerable: false, get: () => start };
    Object.defineProperty(this, `tableStart`, startGetter);
  }
}

export { SimpleTable };
