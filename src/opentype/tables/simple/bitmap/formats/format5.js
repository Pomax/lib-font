/**
 * Glyph bitmap format 5 is similar to format 2 except that no metrics information is included,
 * just the bit aligned data. This format is for use with EBLC indexSubTable format 2 or format
 * 5, which will contain the metrics information for all glyphs.
 */
class Format5 {
    constructor(p, h, w) {
        this.imageData = p.readBytes(Math.ceil(h * w / 8));
    }
}

export { Format5 };
