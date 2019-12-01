let rollout = document.body;
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

function note(msg, style) {
    let div = document.createElement('div')
    div.textContent = msg;
    div.setAttribute(`style`, style);
    rollout.appendChild(div);
}

function heading(msg) {
    note(msg, `font-weight: bold; font-size: 1.5em; padding: 0.5em 0`);
}

function pass(why) {
    note(`${logPad.join('')}✔️${why}`);
}

function fail (a, b, why) {
    note(`${logPad.join('')}❌${why} is false: ${a} is not ${b}`);
}

function assertEqual(a, b, why) {
    if (equal(a,b)) { pass(why); }
    else { fail(a, b, why); }
}

function assertNotEqual(a, b, why) {
    if (equal(a,b)) { fail(a, b, why); }
    else { pass(why); }
}

function indent() {
    logPad.push('\t');
}

function unindent(full) {
    logPad.pop();
    if(full) logPad = [];
}

export { heading, indent, unindent, assertEqual, assertNotEqual };
