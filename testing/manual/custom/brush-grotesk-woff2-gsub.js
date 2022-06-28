import { Font } from "../../../lib-font.js";

const font = new Font("woff2 testing");
font.src = `./fonts/broken/BrushPosterGrotesk.woff2`;
font.onerror = (evt) => console.error(evt);
font.onload = (evt) => {
  let font = evt.detail.font;

  const { GSUB } = font.opentype.tables;
  let scripts = GSUB.getSupportedScripts();

  scripts.forEach((script) => {
    let langsys = GSUB.getSupportedLangSys(script);

    langsys.forEach((lang) => {
      let langSysTable = GSUB.getLangSysTable(script, lang);
      let features = GSUB.getFeatures(langSysTable);

      features.forEach((feature) => {
        const lookupIDs = feature.lookupListIndices;

        lookupIDs.forEach((id) => {
          const lookup = GSUB.getLookup(id);

          const cnt = lookup.subTableCount;
          const s = cnt !== 1 ? "s" : "";
          console.log(
            `lookup type ${lookup.lookupType} in ${lang}, lookup ${id}, ${cnt} subtable${s}`
          );

          /*
          // Only dump lookup type 6 for DFLT/dflt
          if (lookup.lookupType === 6 && lang === "dflt") {

            for(let i=0; i<lookup.subTableCount; i++) {
              let subtable = lookup.getSubTable(i);

              console.log(`=====================================================`);
              console.log(`lookup type 6 in dflt, lookup ${id}, subtable ${i}`);
              console.log(`=====================================================`);


              if (subtable.backtrackGlyphCount > 0)
              subtable.backtrackCoverageOffsets.forEach((offset, id) => {
                let coverage = subtable.getCoverageFromOffset(offset);
                console.log(`backtrack coverage ${id+1}:`, coverage);
              });

              if (subtable.lookaheadGlyphCount > 0)
              subtable.lookaheadCoverageOffsets.forEach((offset, id) => {
                let coverage = subtable.getCoverageFromOffset(offset);
                console.log(`lookahead coverage ${id+1}:`, coverage);
              });

              subtable.seqLookupRecords.forEach(slRecord => {
                console.log(`sequence lookup record:`, slRecord);
              });
            }
          }
          */
        });
      });
    });
  });
};
