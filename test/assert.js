function arrayEqual(a,b) {
    if(!b.map) return false;
    if (a.length !== b.length) return false;
    return a.every((e,i) => equal(e, b[i]));
}

function equal(a, b) {
    if (a.map) return arrayEqual(a,b);
    return (a === b);
}

function assertEqual(a, b, why) {
    if (equal(a,b)) {
        console.log(`✔️`, why);
    } else {
        console.error(`❌`, why, `is false: ${a} is not ${b}`);
    }
}

function assertNotEqual(a, b, why) {
    if (a === b) { console.error(`❌`, why, `${a} should not be ${b}`); }
    else { console.log(`✔️`, why); }
}

export { assertEqual, assertNotEqual };
