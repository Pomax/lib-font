import lazy from "../../../lazy.js";

// basically Format 6, but for 32 bit characters
class Format10 {
    constructor(p) {
        this.format = 10;
        p.uint16;
        this.length = p.uint32;
        this.language = p.uint32;
        this.startCharCode = p.uint32;
        this.numChars = p.uint32;
        const getter = () => [...new Array(this.numChars)].map(_ => p.uint16);
        lazy(this, `glyphs`, getter);
    }

    supports(char) {
        const charcode = char.charCodeAt(0);
        if (charcode < this.startCharCode) return false;
        if (charcode > this.startCharCode + this.numChars) return false;
        return charcode - this.startCharCode;
    }
}

export { Format10 };
