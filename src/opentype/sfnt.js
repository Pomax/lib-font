import { SimpleTable } from "./tables/simple-table.js";
import lazy from "../lazy.js";

/**
 * the SFNT header.
 *
 * See https://docs.microsoft.com/en-us/typography/opentype/spec/overview for more information
 */
class SFNT extends SimpleTable {
  constructor(dataview, createTable) {
    const { p } = super({ offset: 0, length: 12 }, dataview, `sfnt`);

    this.version = p.uint32;
    this.numTables = p.uint16;
    this.searchRange = p.uint16;
    this.entrySelector = p.uint16;
    this.rangeShift = p.uint16;

    p.verifyLength();

    this.directory = [...new Array(this.numTables)].map(
      (_) => new TableRecord(p)
    );

    // add convenience bindings for each table, with lazy loading
    this.tables = {};
    this.directory.forEach((entry) => {
      const getter = () => {
        return createTable(
          this.tables,
          {
            tag: entry.tag,
            offset: entry.offset,
            length: entry.length,
          },
          dataview
        );
      };
      lazy(this.tables, entry.tag.trim(), getter);
    });
  }
}

/**
 * SFNT directory Table Record struct.
 */
class TableRecord {
  constructor(p) {
    this.tag = p.tag;
    this.checksum = p.uint32;
    this.offset = p.uint32;
    this.length = p.uint32;
  }
}

export { SFNT };
