import { SmallGlyphMetrics } from "../shared.js";

class Format17 {
    constructor(p) {
        this.glyphMetrics = new SmallGlyphMetrics(p)
        this.dataLen = p.uint32;
        this.data = p.readBytes(this.dataLen);
    }
}

export { Format17 };
