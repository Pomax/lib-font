import lazy from "../../../../lazy.js";

class Format4 {
    constructor(p) {
        this.format = 4;
        this.length = p.uint16;
        this.language = p.uint16;
        this.segCountX2 = p.uint16;
        this.searchRange = p.uint16;
        this.entrySelector = p.uint16;
        this.rangeShift = p.uint16;

        // defer the rest of the table until we actually need segment information:
        const segCount = this.segCountX2 >> 1;
        const getter = () => {
            const endCode = [...new Array(segCount)].map(_ => p.uint16);
            p.uint16;
            const startCode = endCode.map(_ => p.uint16);
            const idDelta = endCode.map(_ => p.int16);
            const idRangeOffset = endCode.map(_ => p.uint16);
            // Note: we do not build the glyphIdArray[uint16] because we won't be consulting it.

            return endCode.map((_,i) => ({
                start: startCode[i],
                end: endCode[i],
                idDelta: idDelta[i],
                idRangeOffset: idRangeOffset[i]
            }));
        };
        lazy(this, `segments`, getter);

    }

    supports(char) {
        const charcode = char.charCodeAt(0);
        const segments = this.segments;
        let i = segments.findIndex(s => s.start > charcode);
        if (i===0) return false;
        if (i===-1) i = segments.length;
        let s = segments[i-1];
        if (s.end < charcode) return false;
        return charcode + s.idDelta;
    }
}

export { Format4 };
