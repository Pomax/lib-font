import FontNode from './FontNode.js';

const file = process.argv[2];
if (file) {
	new FontNode(file)
		.then(font => {
			console.log('*** FONT DATA ***');
			console.log(font, '\n');
			console.log('*** TABLE DIRECTORIES ***');
			console.log(font.opentype.directory, '\n');
		})
		.catch(error => console.log('ERROR!', error, '\n'));
} else {
	console.warn(`Get the font data by typing: node test/test-node [filename]\n`);
}