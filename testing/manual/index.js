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

        // TODO: FIXME: this seems to be finding GPOS lookups, which shouldn't show up for GSUB?

        lookupIDs.forEach((id) => {
          const lookup = GSUB.getLookup(id);
          const type = lookup.lookupType;
          const cnt = lookup.subTableCount;
          const s = cnt !== 1 ? "s" : "";

          console.log(
            `lookup type ${type} in ${lang}, lookup ${id}, ${cnt} subtable${s}`
          );

          for (let i = 0; i < cnt; i++) {
            const subtable = lookup.getSubTable(i);
            console.log(subtable);
          }
        });
      });
    });
  });
}
