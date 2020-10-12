import { BigGlyphMetrics } from "../shared.js";

/**
 * format 2 for big metrics
 */
class Format7 {
  constructor(p) {
    const mtx = (this.smallMetrics = new BigGlyphMetrics(p));
    const byteCount = Math.ceil((mtx.height * mtx.width) / 8);
    this.imageData = p.readBytes(byteCount);
  }
}

export { Format7 };
