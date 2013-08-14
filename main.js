var http = require('http');
var fs = require('fs');

console.clear();
console.log('Dropzone initialized');

http.createServer(function (req, res) {
	if (req.url == '/') {
		res.setHeader('Content-Type','text/html');
		res.write('<ul>');
		var files = fs.readdirSync('./files/');
		for (i = 0; i < files.length; i++) {
			res.write('<li>' + files[i] + '</li>');
		}
	}
	else {
		
	}
	
	res.end('</ul>');
}).listen(3000);

function onReady() {
	
	window.ondragover = function (e) { e.preventDefault(); return false};
	window.ondrop = function (e) { e.preventDefault(); return false };
	
	var dropzone = document.getElementById('dropzone');
	dropzone.ondrop = function (e) {
		for (i = 0; i < e.dataTransfer.files.length; i++) {
				
			var path = e.dataTransfer.files[i].path;
			var filename = path.split('/')[path.split('/').length - 1];
			console.log(filename);
			console.log(e.dataTransfer.files[i].path);
			fs.symlinkSync(e.dataTransfer.files[i].path, './files/' + filename);
		}
	}
	
	dropzone.ondragenter = function () {
		document.getElementById('drop_message').innerHTML = 'Let go of the mouse button to upload the files.';
	}
	
	dropzone.ondragleave = function () {
		document.getElementById('drop_message').innerHTML = 'Drop files in here to instantly share them!';
	}
	 
	
}