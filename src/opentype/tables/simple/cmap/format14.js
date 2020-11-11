import lazy from "../../../../lazy.js";
import { Subtable } from "./subtable.js";

class Format14 extends Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.subTableStart = p.currentPosition;
    this.format = 14;
    this.length = p.uint32;
    this.numVarSelectorRecords = p.uint32;
    lazy(this, `varSelectors`, () =>
      [...new Array(this.numVarSelectorRecords)].map(
        (_) => new VariationSelector(p)
      )
    );
    console.warn(`cmap subtable format 14 has not been fully implemented`);
  }

  supports() {
    console.warn(`supports not implemented for cmap subtable format 14`);
    return 0;
  }

  getSupportedCharCodes() {
    console.warn(
      `getSupportedCharCodes not implemented for cmap subtable format 14`
    );
    return [];
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 14`);
    return {};
  }

  supportsVariation(variation) {
    let v = this.varSelector.find((uvs) => uvs.varSelector === variation);
    return v ? v : false;
  }

  getSupportedVariations() {
    return this.varSelectors.map((v) => v.varSelector);
  }
}

class VariationSelector {
  constructor(p) {
    this.varSelector = p.uint24;
    this.defaultUVSOffset = p.Offset32;
    this.nonDefaultUVSOffset = p.Offset32;
  }
}

export { Format14 };
