import { LookupType1 } from "../../lookups/gsub/lookup-type-1.js";
import { LookupType2 } from "../../lookups/gsub/lookup-type-2.js";
import { LookupType3 } from "../../lookups/gsub/lookup-type-3.js";
import { LookupType4 } from "../../lookups/gsub/lookup-type-4.js";
import { LookupType5 } from "../../lookups/gsub/lookup-type-5.js";
import { LookupType6 } from "../../lookups/gsub/lookup-type-6.js";
import { LookupType7 } from "../../lookups/gsub/lookup-type-7.js";
import { LookupType8 } from "../../lookups/gsub/lookup-type-8.js";

export default {
  buildSubtable: function (type, p) {
    switch (type) {
      case 1:
        return new LookupType1(p);
      case 2:
        return new LookupType2(p);
      case 3:
        return new LookupType3(p);
      case 4:
        return new LookupType4(p);
      case 5:
        return new LookupType5(p);
      case 6:
        return new LookupType6(p);
      case 7:
        return new LookupType7(p);
      case 8:
        return new LookupType8(p);
    }
  },
};
