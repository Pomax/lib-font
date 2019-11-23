import { BigGlyphMetrics, EBDTComponent } from "../shared.js";

class Format9 {
    constructor(p) {
        this.smallMetrics = BigGlyphMetrics;
        // no padding byte, already aligned with format8
        this.numComponents = p.uint16;
        this.components = [...new Array(this.numComponents)].map(_ => new EBDTComponent(p));
    }
}

export { Format9 };

