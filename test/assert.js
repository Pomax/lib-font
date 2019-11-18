let logPad = [];

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
        console.log(logPad.join(''), `✔️`, why);
    } else {
        console.error(logPad.join(''), `❌`, why, `is false: ${a} is not ${b}`);
    }
}

function assertNotEqual(a, b, why) {
    if (a === b) { console.error(logPad.join(''), `❌`, why, `${a} should not be ${b}`); }
    else { console.log(logPad.join(''), `✔️`, why); }
}

function indent() {
    logPad.push('  ');
}

function unindent(full) {
    logPad.pop();
    if(full) logPad = [];
}

export { indent, unindent, assertEqual, assertNotEqual };
