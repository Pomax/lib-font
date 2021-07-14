import { LookupType1 } from "./lookuptypes/gsub-1.js";
import { LookupType2 } from "./lookuptypes/gsub-2.js";
import { LookupType3 } from "./lookuptypes/gsub-3.js";
import { LookupType4 } from "./lookuptypes/gsub-4.js";
import { LookupType5 } from "./lookuptypes/gsub-5.js";
import { LookupType6 } from "./lookuptypes/gsub-6.js";
import { LookupType7 } from "./lookuptypes/gsub-7.js";
import { LookupType8 } from "./lookuptypes/gsub-8.js";

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
