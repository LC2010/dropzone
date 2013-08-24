$(document).ready(function () {
	$('section#underbar ul li').mouseenter(function () {
		$(this).find('span').fadeIn('fast');
	});
    
    $('section#underbar ul li').mouseleave(function () {
       $(this).find('span').fadeOut('fast');
    });
});

function togo() {
    var link = '/?zip';
    console.log($('section#list table tbody tr td:first-child input'));
    $('section#list table tbody tr td:first-child input').each(function (i) {
        if ($('section#list table tbody tr td:first-child input').is(':checked')) {
            link += '&' + $($('section#list table tbody tr td:first-child input')[i]).attr('class');    
        }
       
    });
    document.location = link;
}