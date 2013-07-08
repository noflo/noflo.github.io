$(document).ready(function() {

	$(".library__item").bind("mouseover", function(event) {
		event.stopPropagation();
		$(this).addClass("library__item--active");
	});

	$(".library__item").bind("mouseout", function(event) {
		event.stopPropagation();
		$(this).removeClass("library__item--active");
	});

	$(".toggle-main-nav").bind("click", function(event) {
		$(this).toggleClass("toggle-menu--open");
		$(".main-nav").toggle();
		return false;
	});

});