var http = require('http');
var fs = require('fs');
var gui = require('nw.gui');
var os = require('os');

var win = gui.Window.get();

win.showDevTools();

console.log('Dropzone initialized');

function start_server() {
	var settings = JSON.parse(localStorage.settings);
	
	console.log('Started the webserver');
	
	dropzone_server = http.createServer(function (req, res) {
		if (req.url == '/') {
			res.setHeader('Content-Type','text/html');
			
			res.write(fs.readFileSync('./resources/server/header.html'));
			
			res.write('<ul>');
			var files = fs.readdirSync(process.cwd() + '/files/');
			for (i = 0; i < files.length; i++) {
				if (req.url == '/') var file_location = req.url + files[i]; 
				else var file_location = req.url + '/' + files[i];
				res.write('<li><a href="' + file_location + '">' + files[i] + '</a></li>');
			}
			
			res.write('</ul>');
			
			res.write(fs.readFileSync('./resources/server/footer.html'));
		}
		else {
			var file_extension = req.url.split('.')[req.url.split('.').length - 1];
			if (file_extension == 'server') {
				var actual_file = req.url.split('.')[req.url.split('.').length - 3] + '.' + req.url.split('.')[req.url.split('.').length - 2];
				res.end(fs.readFileSync('./resources/server/' + actual_file));
			}
			else if (fs.existsSync('./files' + req.url)) {
				res.setHeader('Content-type','application/octet-stream');
				res.end(fs.readFileSync('./files' + req.url));
			}
			else {
				res.end('File not found.');
			}
		}

		res.end();
		
	}).listen(settings.port);
	
}

function stop_server() {
	console.log('Stopped server');
	dropzone_server.close();
}

function restart_server() {
	console.log('Restart server');
	stop_server();
	start_server();
}

function resetFiles() {
	var files = fs.readdirSync('./files/');
	for (i = 0; i < files.length; i++) {
		fs.unlinkSync('./files/' + files[i]);
	}
}