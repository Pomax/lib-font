import { ParsedData } from "../../../../parser.js";

class Subtable extends ParsedData {
  constructor(p, plaformID, encodingID) {
    super(p);
    this.plaformID = plaformID;
    this.encodingID = encodingID;
  }
}

export { Subtable };
