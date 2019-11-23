import { BigGlyphMetrics } from "../shared.js";

class Format18 {
    constructor(p) {
        this.glyphMetrics = new BigGlyphMetrics(p)
        this.dataLen = p.uint32;
        this.data = p.readBytes(this.dataLen);
    }
}

export { Format18 };
