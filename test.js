const test = new Font(`FreeMono`);

test.onerror = evt => console.error('error', evt)
test.onload = evt => console.log('loaded', evt);

test.src = `./fonts/FreeMono.otf`;
