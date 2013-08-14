var current_tab = 'dropzone';

function onReady() {
	
	var dropzone = document.getElementById('dropzone');
	
	dropzone.ondrop = function (e) {
		
		e.preventDefault();
		
		document.getElementById('drop_message').innerHTML = 'Drop files in here to instantly share them!';
		
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