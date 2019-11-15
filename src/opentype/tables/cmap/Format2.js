class Format2 {
    constructor(p) {
        this.format = 2;
        this.length = p.uint16;
        this.language = p.uint16;
        this.subHeaderKeys = [...new Array(256)].map(_ => p.uint16);

        // Where is the number of subheaders recorded? O_o

        /*
            SubHeader 	subHeaders[ ] 	Variable-length array of SubHeader records.
            uint16 	glyphIndexArray[ ] 	Variable-length array containing subarrays used for mapping the low byte of 2-byte characters.
        */
    }

    supports(char) {
        // FIXME: code goes here... later
        return false;
    }
}


class Subheader {
    constructor(p) {
        this.firstCode = p.uint16;
        this.entryCount = p.uint16;
        this.idDelta = p.int16 ;
        this.idRangeOffset = p.uint16;
    }
}

export { Format2 };
