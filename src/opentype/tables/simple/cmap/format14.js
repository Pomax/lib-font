import lazy from "../../../../lazy.js";
import { Subtable } from "./subtable.js";

class Format14 extends Subtable {
  constructor(p, platformID, encodingID) {
    super(p, platformID, encodingID);
    this.subTableStart = p.currentPosition;
    this.format = 14;
    this.length = p.uint32;
    this.numVarSelectorRecords = p.uint32;
    const getter = () =>
      [...new Array(this.numVarSelectorRecords)].map(
        (_) => new VariationSelector(p)
      );
    lazy(this, `varSelectors`, getter);
  }

  supports() {
    return false;
  }

  getSupportedCharCodes() {
    return false;
  }

  supportsVariation(variation) {
    let v = this.varSelector.find((uvs) => uvs.varSelector === variation);
    return v ? v : false;
  }

  reverse(glyphID) {
    console.warn(`reverse not implemented for cmap subtable format 14`);
    return {};
  }

  getSupportedVariations() {
    return []; // TODO: implement this function?
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
