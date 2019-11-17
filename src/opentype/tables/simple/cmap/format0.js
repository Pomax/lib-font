class Format0 {
    constructor(p) {
        this.format = 0;
        this.length = p.uint16;
        this.language = p.uint16;
        // this isn't worth lazy-loading
        this.glyphIdArray = [...new Array(256)].map(_ => p.uint8);
    }

    supports(char) {
        // FIXME: code goes here... later
        return false;
    }
}

export { Format0 };
