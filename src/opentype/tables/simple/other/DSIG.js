import { SimpleTable } from "../../simple-table.js";

/**
 * The OpenType `DSIG` table.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/DSIG
 */
class DSIG extends SimpleTable {
  constructor(dict, dataview) {
    const { p } = super(dict, dataview);
    this.version = p.uint32;
    this.numSignatures = p.uint16;
    this.flags = p.uint16;
    this.signatureRecords = [...new Array(this.numSignatures)].map(
      (_) => new SignatureRecord(p)
    );
  }

  getData(signatureID) {
    const record = this.signatureRecords[signatureID];
    this.parser.currentPosition = this.tableStart + record.offset;
    return new SignatureBlockFormat1(this.parser);
  }
}

class SignatureRecord {
  constructor(p) {
    this.format = p.uint32;
    this.length = p.uint32;
    this.offset = p.Offset32; // from the beginning of the DSIG table
  }
}

class SignatureBlockFormat1 {
  // "Signature blocks may have various formats; currently one format is defined."
  // There is so much optimism here. There might be more formats! We should reserve
  // _multiple_ uint16! We have BIG PLANS! ...some time before 2002!
  constructor(p) {
    p.uint16;
    p.uint16;
    this.signatureLength = p.uint32;
    this.signature = p.readBytes(this.signatureLength); // this is a PKCS#7 packet, and you get to deadl with that yourself.
  }
}

export { DSIG };
