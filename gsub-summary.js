import { Font } from "./lib-font.js";

let font = new Font("test");
font.onerror = evt => console.error(evt);
font.onload = evt => load();
font.src = "./fonts/MehrNastaliqWeb-Regular.ttf";


function load() {
  const { GSUB } = font.opentype.tables;

  let scripts = GSUB.getSupportedScripts();

  scripts.forEach((script) => {
    let langsys = GSUB.getSupportedLangSys(script);

    langsys.forEach((lang) => {
      let langSysTable = GSUB.getLangSysTable(script, lang);
      let features = GSUB.getFeatures(langSysTable);

      features.forEach((feature) => {
        const lookupIDs = feature.lookupListIndices;

        console.log(script, lang, feature.featureTag, lookupIDs);
      });
    });
  });
}
