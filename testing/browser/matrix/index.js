const matrix = [
//
// standard  woff    woff2
// ---------------------------.
    true,    true,   true, // | otf
    true,    true,   true, // | otf var
    true,    true,   true, // | ttf
    true,    true,   true, // | ttf var
];

const container = document.getElementById("matrix");

function listStrings(container, font) {
  // Simple function to verify the name table loaded,
  // and that strings extracted from it make sense.
  const ul = document.createElement("ul");
  const { name } = font.opentype.tables;
  name.nameRecords.forEach((record) => {
    const { nameID, platformID, encodingID, languageID } = record;
    if (nameID > 16) return;
    const li = document.createElement(`li`);
    li.textContent = `[${platformID}/${encodingID}/${languageID}] ${nameID}: ${record.string}`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
  console.log(`Loaded ${font.name}`);
}

// OTF tests

if (matrix.shift()) {
  const otf = new Font(`Adobe Source Code Pro (otf)`);
  otf.onerror = (evt) => console.error("otf error", evt);
  otf.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    p = document.createElement("p");
    container.appendChild(p);
    listStrings(container, font);
  };
  otf.src = `../../../fonts/SourceCodePro/SourceCodePro-Regular.otf`;
}

if (matrix.shift()) {
  const otfWoff = new Font(`Adobe Source Code Pro (otf woff)`);
  otfWoff.onerror = (evt) => console.error("otf.woff error", evt);
  otfWoff.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  otfWoff.src = `../../../fonts/SourceCodePro/SourceCodePro-Regular.otf.woff`;
}

if (matrix.shift()) {
  const otfWoff2 = new Font(`Adobe Source Code Pro (otf woff2)`);
  otfWoff2.onerror = (evt) => console.error("otf.woff2 error", evt);
  otfWoff2.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  otfWoff2.src = `../../../fonts/SourceCodePro/SourceCodePro-Regular.otf.woff2`;
}

// OTF variable font tests

if (matrix.shift()) {
  const varOtf = new Font(`Adobe Source Code Pro (variable otf)`);
  varOtf.onerror = (evt) => console.error("otf (var) error", evt);
  varOtf.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  varOtf.src = `../../../fonts/SourceCodePro/SourceCodeVariable-Roman.otf`;
}

if (matrix.shift()) {
  const varOtfWoff = new Font(`Adobe Source Code Pro (variable otf woff)`);
  varOtfWoff.onerror = (evt) => console.error("otf.woff (var) error", evt);
  varOtfWoff.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  varOtfWoff.src = `../../../fonts/SourceCodePro/SourceCodeVariable-Roman.otf.woff`;
}

if (matrix.shift()) {
  const varOtfWoff2 = new Font(`Adobe Source Code Pro (variable otf woff2)`);
  varOtfWoff2.onerror = (evt) => console.error("otf.woff2 (var) error", evt);
  varOtfWoff2.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  varOtfWoff2.src = `../../../fonts/SourceCodePro/SourceCodeVariable-Roman.otf.woff2`;
}

// TTF tests

if (matrix.shift()) {
  const ttf = new Font(`Adobe Source Code Pro (ttf)`);
  ttf.onerror = (evt) => console.error("ttf error", evt);
  ttf.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  ttf.src = `../../../fonts/SourceCodePro/SourceCodePro-Regular.ttf`;
}

if (matrix.shift()) {
  const ttfWoff = new Font(`Adobe Source Code Pro (ttf woff)`);
  ttfWoff.onerror = (evt) => console.error("ttf.woff error", evt);
  ttfWoff.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  ttfWoff.src = `../../../fonts/SourceCodePro/SourceCodePro-Regular.ttf.woff`;
}

if (matrix.shift()) {
  const ttfWoff2 = new Font(`Adobe Source Code Pro (ttf woff2)`);
  ttfWoff2.onerror = (evt) => console.error("ttf.woff2 error", evt);
  ttfWoff2.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  ttfWoff2.src = `../../../fonts/SourceCodePro/SourceCodePro-Regular.ttf.woff2`;
}

// TTF variable font tests

if (matrix.shift()) {
  const varTTf = new Font(`Adobe Source Code Pro (variable ttf)`);
  varTTf.onerror = (evt) => console.error("ttf (var)error", evt);
  varTTf.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  varTTf.src = `../../../fonts/SourceCodePro/SourceCodeVariable-Roman.ttf`;
}

if (matrix.shift()) {
  const varTTfWoff = new Font(`Adobe Source Code Pro (variable ttf woff)`);
  varTTfWoff.onerror = (evt) => console.error("ttf.woff (var)error", evt);
  varTTfWoff.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  varTTfWoff.src = `../../../fonts/SourceCodePro/SourceCodeVariable-Roman.ttf.woff`;
}

if (matrix.shift()) {
  const varTTfWoff2 = new Font(`Adobe Source Code Pro (variable ttf woff2)`);
  varTTfWoff2.onerror = (evt) => console.error("ttf.woff2 (var) error", evt);
  varTTfWoff2.onload = (evt) => {
    let font = evt.detail.font;
    let p = document.createElement("p");
    p.setAttribute("style", `font-family: "${font.name}";`);
    p.textContent = `Test line for ${font.name}`;
    container.appendChild(p);
    listStrings(container, font);
  };
  varTTfWoff2.src = `../../../fonts/SourceCodePro/SourceCodeVariable-Roman.ttf.woff2`;
}
