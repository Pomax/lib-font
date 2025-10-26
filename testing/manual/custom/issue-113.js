import { Font } from "../../../lib-font.js";

// Create a font object
const myFont = new Font(`Lib Font Test Font`);

// Assign event handling (.addEventListener version supported too, of course)
myFont.onerror = (evt) => console.error(evt);
myFont.onload = (evt) => doSomeFontThings(evt);

// Kick off the font load by setting a source file, exactly as you would
myFont.src = `./fonts/Lato-Regular.ttf`;

// When the font's up and loaded in, let's do some testing!
function doSomeFontThings(evt) {
  const font = evt.detail.font;
  const GSUB = font.opentype.tables.GSUB;

  const scripts = GSUB.getSupportedScripts();
  let allGlyphs = {};

  scripts.forEach((script, scriptId) => {
    let langsys = GSUB.getSupportedLangSys(script);

    allGlyphs[script] = {};

    console.log(`script id ${scriptId}`);

    langsys.forEach((lang, langId) => {
      let langSysTable = GSUB.getLangSysTable(script, lang);
      let features = GSUB.getFeatures(langSysTable);

      allGlyphs[script][lang] = {};

      console.log(`|--lang id ${langId}`);

      features.forEach((feature, featureId) => {
        const lookupIDs = feature.lookupListIndices;
        allGlyphs[script][lang][feature.featureTag] = {};
        allGlyphs[script][lang][feature.featureTag]["lookups"] = [];

        console.log(`| |--feature id ${featureId}`);

        lookupIDs.forEach((id, lookupId) => {
          const lookup = GSUB.getLookup(id);

          console.log(`| | |--lookup id ${lookupId}`);

          lookup.subtableOffsets.forEach((_, i) => {
            const subtable = lookup.getSubTable(i);

            console.log(
              `| | | |--subtable id ${i} (type ${lookup.lookupType}, substFormat ${subtable.substFormat})`
            );

            if (lookup.lookupType === 6) {
              const inputGlyphCount = subtable.inputGlyphCount;

              console.log(
                `| | | | |--subtable glyph count: ${inputGlyphCount}`
              ); // ❌

              const chainSubRuleSetCount = subtable.chainSubRuleSetCount;
              console.log(
                `| | | | |--chainSubRuleSetCount: ${chainSubRuleSetCount}`
              );

              for (let css = 0; css < chainSubRuleSetCount; css++) {
                const chainSubRuleSet = subtable.getChainSubRuleSet(css);
                const chainSubRuleCount = chainSubRuleSet.chainSubRuleCount;
                console.log(
                  `| | | | | |--chainSubRuleCount for set ${css}: ${chainSubRuleCount}`
                );

                for (let csr = 0; csr < chainSubRuleCount; csr++) {
                  const chainSubRule = chainSubRuleSet.getSubRule(csr);
                  const inputGlyphCount = chainSubRule.inputGlyphCount;
                  console.log(
                    `| | | | | | |--inputGlyphCount for rule ${csr}: ${inputGlyphCount}`
                  );
                }
              }
            }
          });
        });
      });
    });
  });
}
