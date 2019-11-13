const test = new Font(`Adobe Source Sans Pro`);

test.onerror = evt => console.error('error', evt)
test.onload = evt => console.log('loaded', evt);

test.src = `./fonts/SourceSansPro-Regular.otf.woff2`;
