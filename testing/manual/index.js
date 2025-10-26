import { Font } from "../../lib-font.js";

const font = new Font("woff2 testing");
font.onerror = (evt) => console.error(evt);
font.onload = (evt) => {
  let font = evt.detail.font;

  Object.entries(font.opentype.tables).forEach((v) => console.log(v[0]));

  const { GSUB } = font.opentype.tables;
  processGSUB(GSUB);
};

const fonts = [
  //  `../../../fonts/AthenaRuby_b018.ttf`,
  `../../../fonts/Lato-Regular.ttf`,
];

font.src = fonts[0];

function processGSUB(GSUB) {
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

          if (lookup.lookupType === 7) {
            for (let i = 0; i < cnt; i++) {
              const subtable = lookup.getSubTable(i);
              console.log(
                `  32 bit lookup hack. Actually a pointer to lookup type ${
                  subtable.extensionLookupType
                } at offset ${subtable.start + subtable.extensionOffset}`
              );
              const extensionLookup = subtable.getLookup();
              console.log(extensionLookup);
            }
          }
        });
      });
    });
  });
}
