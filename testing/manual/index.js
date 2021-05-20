const font = new Font("woff2 testing");
font.onerror = (evt) => console.error(evt);
font.onload = (evt) => {
  let font = evt.detail.font;

  const { GSUB } = font.opentype.tables;
  processGSUB(GSUB);
};

const fonts = [
  `/fonts/broken/BrushPosterGrotesk.woff2`,
  `/fonts/broken/135abd30-1390-4f9c-b6a2-d843157c3468.woff2`, // No GSUB table?
  `/fonts/broken/64017d81-9430-4cba-8219-8f5cc28b923e.woff2`, // No GSUB table?
  `/fonts/broken/proximanova-regular-webfont.woff2`,
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
        });
      });
    });
  });
}
