import lazy from "../../../../lazy.js";

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

    getSupportedCharCodes(preservePropNames=false) {
        if (preservePropNames) return this.groups;
        return this.groups.map(v => ({ start: v.startCode, end: v.endCode}));
    }
}

class SequentialMapGroup {
    constructor(p) {
        this.startcharCode = p.uint32;
        this.endcharCode = p.uint32;
        this.startGlyphID = p.uint32;
    }
}

export { Format8 };
