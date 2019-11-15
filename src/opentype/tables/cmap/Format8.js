import lazy from "../../../lazy.js";

class Format8 {
    constructor(p) {
        this.format = 8;
        p.uint16;
        this.length = p.uint32;
        this.language = p.uint32;
        this.is32 = [...new Array(8192)].map(_ => p.uint8);
        this.numGroups = p.uint32;
        const getter = () => [...new Array(this.numGroups)].map(_ => new SequentialMapGroup(p));
        lazy(this, `groups`, getter);
    }

    supports(char) {
        const charcode = char.charCodeAt(0);
        const groups = this.groups;
        let i = groups.findIndex(s => s.startCharCode > charcode);
        if (i===0) return false;
        if (i===-1) i = groups.length;
        let g = groups[i-1];
        if (g.endCharCode < charcode) return false;
        return charcode - g.startCharCode + g.startGlyphID;
    }
}

class SequentialMapGroup {
    constructor(p) {
        this.startCharCode = p.uint32;
        this.endCharCode = p.uint32;
        this.startGlyphID = p.uint32;
    }
}

export { Format8 };
