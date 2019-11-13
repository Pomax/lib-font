const test = new Font(`Adobe Source Code Pro`);

test.onerror = evt => console.error('error', evt)
test.onload = evt => console.log('loaded', evt);

test.src = `./test/SourceCodePro-Regular.otf.woff2`;
