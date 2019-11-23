/**
 * Similar to bitmap format 5, the metrics for this format are not
 * stored in the bitmap format itself, but in the CBLC table.
 */
class Format19 {
    constructor(p) {
        this.dataLen = p.uint32;
        this.data = p.readBytes(this.dataLen);
    }
}

export { Format19 };
