//Import modules
var http = require('http');
var fs = require('fs');
var gui = require('nw.gui');
var os = require('os');

var win = gui.Window.get();

//Make sure that the devtools popup.
win.showDevTools();

console.log('Dropzone initialized');

//Function for starting the backend webserver for serving files to clients.
function start_server() {
	//Get settings from the localStorage database.
	
	var settings = JSON.parse(localStorage.settings);
	console.log('Started the webserver');
	
	//Create a new server object
	dropzone_server = http.createServer(function (req, res) {
		//When the request is root then :
		if (req.url == '/') {
			//Set header to HTML.
			res.setHeader('Content-Type','text/html');
			//Load the header.html
			res.write(fs.readFileSync('./resources/server/header.html'));
			res.write('<section class="list">')
			//Start of list generation.
			res.write('<table>');
			//Get files in ./files directory.
			var files = fs.readdirSync(process.cwd() + '/files/');
			res.write('<tr><th>File</th><th>Download</th></tr>')
			for (i = 0; i < files.length; i++) {
				if (req.url == '/') var file_location = req.url + files[i]; 
				else var file_location = req.url + '/' + files[i];
				res.write('<tr><td><a href="' + file_location + '">' + files[i] + '</a></td><td><a href="' + file_location + '?download">Download</a></td></tr>');
			}
			//Stop of list generation.
			res.write('</table>');
			//Load footer.
			res.write(fs.readFileSync('./resources/server/footer.html'));
		}
		else {
			var reqtype = req.url.split('?');
			//Replace all of the URL encoded spaces.
			req.url = reqtype[0].replace(/%20/g, ' ');
			reqtype = reqtype[reqtype.length - 1];
			console.log(reqtype);
			//Get the file extensions.
			var file_extension = req.url.split('.')[req.url.split('.').length - 1];
			
			//If the file extension is .server, then load the file from server resources.
			if (file_extension == 'server') {
				var actual_file = req.url.split('.')[req.url.split('.').length - 3] + '.' + req.url.split('.')[req.url.split('.').length - 2];
				res.end(fs.readFileSync('./resources/server/' + actual_file));
			}
			else if (fs.existsSync('./files' + req.url)) {
				if (reqtype == 'download') {
					res.setHeader('Content-type','application/octet-stream');
					res.write(fs.readFileSync('./files' + req.url));	
				}
				else if (reqtype == 'raw') {
					res.write(fs.readFileSync('./files' + req.url));
				}
				else {
					//If the file extension is an image, show it to the user in the dropzone UI.
					if (file_extension == 'png' || file_extension == 'jpg' || file_extension == 'jpeg' || file_extension == 'gif') {
						var filename = req.url.split('/')[req.url.split('/').length - 1];
						res.write(fs.readFileSync('./resources/server/header.html'));
						res.write('<section id="image">');
						res.write('<h3>Image - ' + filename + '</h3>');
						res.write('<img src="' + req.url + '?raw" />');
						res.write(fs.readFileSync('./resources/server/footer.html'));
					}
					else {
						res.setHeader('Content-type','text/plain');
						res.write(fs.readFileSync('./files' + req.url));	
					}
				}
			}
			else {
				//If the file isn't found, return 'File not found.'.
				res.end('File not found.');
			}
		}
		//Stop the response.
		res.end();
	
	}).listen(settings.port); //Listen to the port specified in the settings.
	
}

//Function for stopping the server.
function stop_server() {
	console.log('Stopped server');
	dropzone_server.close();
}

//Function for restarting the server.
function restart_server() {
	console.log('Restart server');
	stop_server();
	start_server();
}

//Function to reset served files.
function resetFiles() {
	var files = fs.readdirSync('./files/');
	//Get all of the files and remove them from the filesystem.
	for (i = 0; i < files.length; i++) {
		fs.unlinkSync('./files/' + files[i]);
	}
}