function share() {
	var shareurl = window.location.origin;
	console.log('Sharing ' + shareurl);
}

$(document).ready(function () {
	$('section#underbar ul li').mouseenter(function () {
		$(this).find('span').fadeIn('fast');
	});
    
    $('section#underbar ul li').mouseleave(function () {
       $(this).find('span').fadeOut('fast');
    });
});