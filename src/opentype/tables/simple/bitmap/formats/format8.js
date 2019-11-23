import { SmallGlyphMetrics, EBDTComponent } from "../shared.js";

class Format8 {
    constructor(p) {
        this.smallMetrics = SmallGlyphMetrics;
        p.uint8; // padding byte, makes the next fields align with format9
        this.numComponents = p.uint16;
        this.components = [...new Array(this.numComponents)].map(_ => new EBDTComponent(p));
    }
}

export { Format8 };

