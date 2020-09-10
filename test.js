
import { Font } from "./Font.js";

const f = new Font("gsub testing");

f.onerror = e => console.error(e);

f.onload = function(e) {
    const font = e.detail.font;
    const { cmap, name, GSUB } = font.opentype.tables;

    function letterFor(glyphid) {
        let code = cmap.reverse(glyphid);
        let letter = code ? String.fromCharCode(code) : '??';
        return letter;
    }

    console.log(`font supports 'f': ${font.supports(`f`)} (glyphid: ${font.getGlyphId(`f`)})`);
    console.log(`font supports 'i': ${font.supports(`i`)} (glyphid: ${font.getGlyphId(`i`)})`);

    const liga = GSUB.getFeature(`liga`);
    const lookupIDs = liga.lookupListIndices;
    lookupIDs.forEach(id => {
        const lookup = GSUB.getLookup(id);

        //console.log(lookup);

        if (lookup.lookupType === 4) {
            lookup.subtableOffsets.forEach((_,i) => {
                const subtable = lookup.getSubTable(i);
                //console.log(subtable);

                const coverage = subtable.getCoverageTable();
                //console.log(coverage);

                subtable.ligatureSetOffsets.forEach((_,i) => {
                    const ligatureSet = subtable.getLigatureSet(i);

                    //console.log(ligatureSet);

                    ligatureSet.ligatureOffsets.forEach((_,i) => {
                        const ligatureTable = ligatureSet.getLigature(i);

                        //console.log(ligatureTable);

                        const sequence = [coverage.glyphArray[0], ...ligatureTable.componentGlyphIDs];
                        console.log(`Ligature sequence: {${sequence.join(`,`)}} -> ${ligatureTable.ligatureGlyph}`);
                        console.log(`= '${sequence.map(letterFor).join(`' + '`)}' -> '${letterFor(ligatureTable.ligatureGlyph)}'`);
                    });
                });
            });
        }
    });
}

f.src = "./fonts/Recursive_VF_1.064.ttf";
