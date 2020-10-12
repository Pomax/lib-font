class LookupType1 {
    constructor(p) {
        console.log(`lookup type 1`);
    }
}

class LookupType2 {
    constructor(p) {
        console.log(`lookup type 2`);
    }
}

class LookupType3 {
    constructor(p) {
        console.log(`lookup type 3`);
    }
}

class LookupType4 {
    constructor(p) {
        console.log(`lookup type 4`);
    }
}

class LookupType5 {
    constructor(p) {
        console.log(`lookup type 5`);
    }
}

class LookupType6 {
    constructor(p) {
        console.log(`lookup type 6`);
    }
}

class LookupType7 {
    constructor(p) {
        console.log(`lookup type 7`);
    }
}

class LookupType8 {
    constructor(p) {
        console.log(`lookup type 8`);
    }
}

class LookupType9 {
    constructor(p) {
        console.log(`lookup type 9`);
    }
}

export default {
    buildSubtable: function(type, p) {
        switch(type) {
            case(1): return new LookupType1(p);
            case(2): return new LookupType2(p);
            case(3): return new LookupType3(p);
            case(4): return new LookupType4(p);
            case(5): return new LookupType5(p);
            case(6): return new LookupType6(p);
            case(7): return new LookupType7(p);
            case(8): return new LookupType8(p);
            case(9): return new LookupType9(p);
        }
    }
};
