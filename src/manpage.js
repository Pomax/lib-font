// Shim for "man" template tag

(function (scope) {
  scope.man = function man(argv) {
    const term = argv[0];
    let data = scope[term].manPage;
    if (data) {
      if (typeof data === "string") console.log(data);
      else console.log(data.text, ...data.styles);
    }
  };
})(globalThis);

// data containers

const text = [];
const styles = [];

// manpage writing function

const add = (t, style = ``) => {
  text.push(t);
  styles.push(`${style};display:block`);
};

// common styles

const heading = `font-size: 1.5em; padding: 10px 0;`;
const dt = `font-weight: bold; margin-left: 1em;`;
const dd = `margin-left: 2em;`;
const code = `font-family: monospace; background: #FFE; width: 100%;`;

// The actual manpage data

add(`Usage`, heading);
add(
  `let myFont = new Font(name, options);
myFont.onerror = evt => ...
myFont.onload = evt => ...
myFont.onunload = evt => ...
font.src = urlString;`,
  code
);

add(`Constructor options:`, heading);
add(`name`, dt);
add(`The name used as font-family CSS property for this font.`, dd);
add(`options`, dt);
add(
  `An optional key/value object for additional CSS properties. See https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face for which properties you can specify.`,
  dd
);

add(`load events:`, heading);
add(`onerror`, dt);
add(`...`, dd);
add(`onload`, dt);
add(`...`, dd);
add(`onunload`, dt);
add(`...`, dd);

add(`Details:`, heading);
add(`This can only get more delicious...`);

add(
  `For additional information, please visit https://github.com/Pomax/Font.js`
);

// Assemble and return

const manPage = { text: `%c${text.join(`%c`)}`, styles };
export { manPage };
