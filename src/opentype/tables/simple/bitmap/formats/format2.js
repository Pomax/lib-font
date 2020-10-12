import { SmallGlyphMetrics } from "../shared.js";

class Format2 {
  constructor(p) {
    const mtx = (this.smallMetrics = new SmallGlyphMetrics(p));
    const byteCount = Math.ceil((mtx.height * mtx.width) / 8);
    this.imageData = p.readBytes(byteCount);
  }
}

export { Format2 };
