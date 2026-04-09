import assert from "node:assert";
import { profiles } from "../font-profiles/profiles.js";

function testGSUB(font, tests) {
  const expectation = profiles[font.name];

  const { cmap, name, GSUB } = font.opentype.tables;

  assert.ok(GSUB !== undefined);
  assert.ok(cmap !== undefined);
  assert.ok(name !== undefined);

  let scripts = GSUB.getSupportedScripts();
  assert.deepStrictEqual(scripts, Object.keys(expectation));

  scripts.forEach((script) => {
    tests.script.forEach(fn => fn(script));

    let langsys = GSUB.getSupportedLangSys(script);

    assert.deepStrictEqual(langsys, expectation[script].langsys);

    langsys.forEach((lang) => {
      let langSysTable = GSUB.getLangSysTable(script, lang);
      let features = GSUB.getFeatures(langSysTable);
      let featureCount = features.length;

      assert.deepStrictEqual(featureCount, expectation[script].features[lang].length);

      features.forEach((feature) => {
        tests.feature.forEach(fn => fn(feature));

        const lookupIDs = feature.lookupListIndices;

        const actual = {
          script,
          lang,
          feature: feature.featureTag,
          lookupIDs
        };

        const expected = {
          script,
          lang,
          feature: feature.featureTag,
          lookupIDs: expectation[script].features[lang].lookups[feature.featureTag]
        };

        assert.deepStrictEqual(actual, expected);

        lookupIDs.forEach((id) => {
          const lookup = GSUB.getLookup(id);
          tests.lookup.forEach(fn => fn(font, script, lang, feature.featureTag, id, lookup));
        });
      });
    });
  });
}

export { testGSUB };
