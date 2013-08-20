//Set the current_tab variable to the home tab : dropzone.
var current_tab = 'dropzone';

//Function for when the page is ready.
function onReady() {
	
	//Load the settings and start the backend webserver.
	loadSettings();
	start_server();
	
	//Define the dropzone DOM element.
	var dropzone = document.getElementById('dropzone');
	
	//Event for when the client drops file in the dropzone.
	dropzone.ondrop = function (e) {
		
		//Make sure that the window doesn't show the file in plain text.
		e.preventDefault();
		
		//Change the inside message of the dropzone to 'Drop files in here to instantly share them!'
		document.getElementById('drop_message').innerHTML = 'Drop files in here to instantly share them!';
		
		//Make sure that all of the files that are dropped in get linked inside the ./files/ folder inside the application.
		for (i = 0; i < e.dataTransfer.files.length; i++) {
			//Get the path of the file.
			var path = e.dataTransfer.files[i].path;
			//Here's a small glitch that needed to be fixed in Windows, not even sure if I'll release it on that platform -_-.
			path = path.replace(/\\/g, "/");
			//Get the filename
			var filename = path.split('/')[path.split('/').length - 1];
			//Log the filename, path and link path.
			console.log('Filename : ' + filename);
			console.log('Path : ' + e.dataTransfer.files[i].path);
			console.log('Link Path : ' + process.cwd() + '/files/' + filename);
			//In windows, copy the file to the directory if it's another system, create a symbolic link.
			if (os.platform() != 'win32') {
				fs.symlinkSync(e.dataTransfer.files[i].path, process.cwd() + '/files/' + filename, 'file');	
			}
			else {
				fs.linkSync(e.dataTransfer.files[i].path, process.cwd() + '/files/' + filename);
			}
			
		}
		
	}
	
	//An event for when the user enters the drag field with files.
	dropzone.ondragenter = function () {
		//Make sure that the message inside is changed.
		document.getElementById('drop_message').innerHTML = 'Let go of the mouse button to upload the files.';
	}
	
	//Another event for when the user leaves the dropzone.
	dropzone.ondragleave = function () {
		//Make sure that the message inside is changed.
		document.getElementById('drop_message').innerHTML = 'Drop files in here to instantly share them!';
	}
	
	//Events for the navigation buttons.
	$('ul#menubar li').click(function (e) {
		if (e.toElement.className != 'reset') {
			go(e.toElement.className);
		}
		else if (e.toElement.className == 'reset' && e.which == 2) {
			resetFiles();
			feedback('Reset all hosted files.');
		}
		else {
			feedback('Middle-click to reset hosted files.');
		}
	
	});
}

//Function for switching tabs inside the application.
function go(tab) {
	var speed = 1500;
	if (tab == current_tab) return;
	else current_tab = tab;
	$('section').fadeOut(speed, function () {
		setTimeout(function () {
			$('section#' + tab ).fadeIn(speed);
		},speed);
	});
}

//Load settings function.
function loadSettings() {
	console.log('Loaded settings');
	var port_setting = document.getElementById('port_setting');
	var name_setting = document.getElementById('name_setting');
	
	if (!(localStorage.settings)) {
		var settings = {
				port : 3000,
				name : "Dropzone"
		}
	}
	else {
		var settings = JSON.parse(localStorage.settings);
	}
	
	port_setting.value = settings.port;
	name_setting.value = settings.name;
	
	port_setting.onkeyup = function (e) {
		if (e.which == 13) {
			extractSettings();
		}
	}
	name_setting.onkeyup = function (e) {
		if (e.which == 13) {
			extractSettings();
		}
	}
	localStorage.setItem('settings', JSON.stringify(settings));
}

//A function for extracting settings.
function extractSettings() {
	console.log('Extracted settings.');
	var port_setting = document.getElementById('port_setting').value;
	var name_setting = document.getElementById('name_setting').value;
	
	var settings = {
			port : port_setting,
			name : name_setting
	}
	localStorage.setItem('settings', JSON.stringify(settings));
}

//A feedback function to provide feedback to the client.
function feedback(msg) {
	var speed = 400;
	var wait = 2000;
	
	$('div#alert').html(msg);
	$('div#alert').fadeIn(speed, function () {
		setTimeout(function () {
			$('div#alert').fadeOut(speed);
		}, wait);
	});
}