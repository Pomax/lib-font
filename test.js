import { Font } from "./Font.js";

const f = new Font("gsub testing");

f.onerror = (e) => console.error(e);

f.onload = function (e) {
  const font = e.detail.font;
  const { cmap, name, GSUB } = font.opentype.tables;

  function letterFor(glyphid) {
    let code = cmap.reverse(glyphid);
    let letter = code ? String.fromCharCode(code) : "??";
    return letter;
  }

  console.log(
    `font supports 'f': ${font.supports(`f`)} (glyphid: ${font.getGlyphId(
      `f`
    )})`
  );

  console.log(
    `font supports 'i': ${font.supports(`i`)} (glyphid: ${font.getGlyphId(
      `i`
    )})`
  );

  let scripts = GSUB.getSupportedScripts();
  // console.log(`font supports GSUB scripts ${scripts.join(`,`)}`);

  scripts.forEach((script) => {
    let langsys = GSUB.getSupportedLangSys(script);
    // console.log(`Script ${script} has langsys ${langsys.join(`,`)}`);

    langsys.forEach((sys) => {
      let table = GSUB.getLangSysTable(script, sys);
      let features = GSUB.getFeatures(table);

      // console.log(
      //   `Script ${script} with langsys ${sys} has features ${features
      //     .map((v) => v.featureTag)
      //     .join(`,`)}`
      // );

      features.forEach((feature) => {
        const lookupIDs = feature.lookupListIndices;

        lookupIDs.forEach((id) => {
          const lookup = GSUB.getLookup(id);

          // console.log(
          //   script,
          //   sys,
          //   feature.featureTag,
          //   `uses lookup type`,
          //   lookup.lookupType
          // );

          if (lookup.lookupType === 1) {
            lookup.subtableOffsets.forEach((_, i) => {
              const subtable = lookup.getSubTable(i);
              const coverage = subtable.getCoverageTable();
              let glyphs = coverage.glyphArray;
              if (!glyphs) {
                glyphs = coverage.rangeRecords.map(
                  (r) => `${r.startGlyphID}-${r.endGlyphID}`
                );
              }
              console.log(
                `[${script}:${sys}:${feature.featureTag}] add ${
                  subtable.deltaGlyphID
                } to [${glyphs.join(`,`)}]`
              );
            });
          }

          if (lookup.lookupType === 4) {
            lookup.subtableOffsets.forEach((_, i) => {
              const subtable = lookup.getSubTable(i);
              // console.log(subtable);

              const coverage = subtable.getCoverageTable();
              // console.log(coverage);

              subtable.ligatureSetOffsets.forEach((_, i) => {
                const ligatureSet = subtable.getLigatureSet(i);

                // console.log(ligatureSet);

                ligatureSet.ligatureOffsets.forEach((_, i) => {
                  const ligatureTable = ligatureSet.getLigature(i);

                  // console.log(ligatureTable);

                  const sequence = [
                    coverage.glyphArray[0],
                    ...ligatureTable.componentGlyphIDs,
                  ];
                  console.log(
                    `[${script}:${sys}:${
                      feature.featureTag
                    }] has ligature sequence: {${sequence.join(`,`)}} -> ${
                      ligatureTable.ligatureGlyph
                    } (= '${sequence
                      .map(letterFor)
                      .join(`' + '`)}' -> '${letterFor(
                      ligatureTable.ligatureGlyph
                    )}')`
                  );
                });
              });
            });
          }
        });
      });
    });
  });
};

f.src = "./fonts/Recursive_VF_1.064.ttf";
