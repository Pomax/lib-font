import './Font.js';
const express = require('express');
const fs = require('fs');
const http = require('http');

const myApp = express();
const mimetype = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.txt': 'text/plain',
	'.jpg': 'image/jpeg',
	'.gif': 'image/gif',
	'.bmp': 'image/bmp',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.ttf': 'application/x-font-ttf',
	'.woff': 'application/x-font-woff',
	'.woff2': 'text/plain',
	'.fon': 'application/octet-stream',
	'.ogv': 'application/ogg',
	'.wav': 'audio/mpeg',
	'.mp3': 'audio/mpeg',
	'.ogg': 'audio/ogg'
};
const out = process.stdout;

myApp.use(bodyParser.urlencoded({
	extended: true
}));
myApp.use(bodyParser.json());

process.env.TZ = 'Europe/Amsterdam';

Font.loadFont = function (file) {
	// TODO: recreate the fetch stuff ↑ with Node's fs

	// Load the font from filesytem -- so far, so good
	let response = fs.readFileSync(file);

	// Now, recreate the response/buffer stuff so Font.js can continue
	// Once the font has been turned into a buffer/object/thingy that
	// Font.js expects, I think it will work the same as in the browser
	// from there on.

	// response = response.arrayBuffer()
	// this.fromDataBuffer(response, type);
	// console.log(font.toString());
}

myApp.get('/fonts/*', (req, resp) => {
	const requestUrl = req.url.substring(1);
	const ext = requestUrl.replace(/^.*(?=\.)/, '');
	const name = requestUrl.replace(/^.*\/(.*?)\..*??$/, '$1');
	const font = new Font(name);
	const mime = mimetype[ext] || 'text/html';
	fetch(requestUrl, (error, data) => {
		resp.writeHead(200, {
			'Content-Type': mime
		});
		font.loadFont(data)
	});
});

const httpServer = http.createServer(myApp);
httpServer.listen(process.env.PORT || 8080);
