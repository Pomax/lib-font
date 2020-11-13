import { expect } from "@jest/globals";
import { profiles } from "../font-profiles/profiles.js";

function testGSUB(font, tests) {
  const expectation = profiles[font.name];

  const { cmap, name, GSUB } = font.opentype.tables;

  expect(GSUB).toBeDefined();
  expect(cmap).toBeDefined();
  expect(name).toBeDefined();

  let scripts = GSUB.getSupportedScripts();
  expect(scripts).toEqual(Object.keys(expectation));

  scripts.forEach((script) => {
    tests.script.forEach(fn => fn(script));

    let langsys = GSUB.getSupportedLangSys(script);

    expect(langsys).toEqual(expectation[script].langsys);

    langsys.forEach((lang) => {
      let langSysTable = GSUB.getLangSysTable(script, lang);
      let features = GSUB.getFeatures(langSysTable);
      let featureCount = features.length;

      expect(featureCount).toEqual(expectation[script].features[lang].length);

      features.forEach((feature) => {
        tests.feature.forEach(fn => fn(feature));

        const lookupIDs = feature.lookupListIndices;

        const test = {
          script,
          lang,
          feature: feature.featureTag,
          lookupIDs
        };

        const match = {
          script,
          lang,
          feature: feature.featureTag,
          lookupIDs: expectation[script].features[lang].lookups[feature.featureTag]
        };

        expect(test).toEqual(match);

        lookupIDs.forEach((id) => {
          const lookup = GSUB.getLookup(id);
          tests.lookup.forEach(fn => fn(font, script, lang, feature.featureTag, id, lookup));
        });
      });
    });
  });
}

export { testGSUB };
