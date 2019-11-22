import lazy from "../../../../lazy.js";

// basically Format 8, but for 32 bit characters
class Format12 {
    constructor(p) {
        this.format = 12;
        p.uint16;
        this.length = p.uint32;
        this.language = p.uint32;
        this.numGroups = p.uint32;
        const getter = () => [...new Array(this.numGroups)].map(_ => new SequentialMapGroup(p));
        lazy(this, `groups`, getter);
    }

    supports(charCode) {
        if (charCode.charCodeAt) charCode = charCode.charCodeAt(0);
        const groups = this.groups;
        let i = groups.findIndex(s => s.startcharCode > charCode);
        if (i===0) return false;
        if (i===-1) i = groups.length;
        let g = groups[i-1];
        if (g.endcharCode < charCode) return false;
        return charCode - g.startcharCode + g.startGlyphID;
    }
}

class SequentialMapGroup {
    constructor(p) {
        this.startCharCode = p.uint32;
        this.endCharCode = p.uint32;
        this.startGlyphID = p.uint32;
    }
}

export { Format12 };
