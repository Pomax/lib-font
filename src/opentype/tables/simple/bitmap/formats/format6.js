import { BigGlyphMetrics } from "../shared.js";

/**
 * format 1 for big metrics
 */
class Format6 {
  constructor(p) {
    const mtx = (this.smallMetrics = new BigGlyphMetrics(p));
    /**
     * The bitmap data begins with the most significant bit of the first byte
     * corresponding to the top-left pixel of the bounding box, proceeding through
     * succeeding bits moving left to right. The data for each row is padded to a
     * byte boundary, so the next row begins with the most significant bit of a new byte.
     */
    const byteCount = mtx.height * Math.ceil(mtx.width / 8);
    this.imageData = p.readBytes(byteCount);
  }
}

export { Format6 };
