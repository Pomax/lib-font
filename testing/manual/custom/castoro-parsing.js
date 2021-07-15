import { Font } from "../../../lib-font.js";

const font = new Font("castoro");
font.onload = (evt) => {
  try {
    testFont(evt.detail.font);
  } catch (e) {
    console.error(e);
  }
};

font.src = "./fonts/issue-123/Castoro-Regular.woff2";

function testFont(font) {
  const { GSUB } = font.opentype.tables;
  const scripts = GSUB.getSupportedScripts();
  let allGlyphs = {};

  scripts.forEach((script) => {
    let langsys = GSUB.getSupportedLangSys(script);

    allGlyphs[script] = {};

    langsys.forEach((lang) => {
      let langSysTable = GSUB.getLangSysTable(script, lang);
      let features = GSUB.getFeatures(langSysTable);

      allGlyphs[script][lang] = {};

      features.forEach((feature) => {
        const lookupIDs = feature.lookupListIndices;
        allGlyphs[script][lang][feature.featureTag] = {};
        allGlyphs[script][lang][feature.featureTag]["lookups"] = [];

        lookupIDs.forEach((id) => {
          const lookup = GSUB.getLookup(id);

          lookup.subtableOffsets.forEach((_, i) => {
            const subtable = lookup.getSubTable(i);
            console.log(
              `Getting subtable ${i}, lookup ${id}, lookuptype ${subtable.substFormat}, feature ${feature.featureTag}, script ${script} , lang ${lang}`
            );
          });
        });
      });
    });
  });
}
