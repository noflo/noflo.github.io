$(document).ready(function() {

	/**
	* Main Nav 
	*/
	$(".toggle-main-nav").bind("click", function(event) {
		$(this).toggleClass("toggle-menu--open");
		$(".main-nav").toggle();
		return false;
	});

	/**
	* Search Bar
	*/
	$(".toggle-search").bind("click", function(event) {
		$(this).toggleClass("toggle-search--active");
		$(".search-form").toggle();
		$(".main-nav").toggle();
		return false;
	});

	$(".search__keywords").bind("keyup", function() {
		var search_prompt = $(".search-prompt");
		if($(this).val().length > 0) {
			search_prompt.show();
		} else {
			search_prompt.hide();
		}
	});

	/**
	* Library Items
	*/
	$(".library__item").bind("mouseover", function(event) {
		event.stopPropagation();
		$(this).addClass("library__item--active");
	});

	$(".library__item").bind("mouseout", function(event) {
		event.stopPropagation();
		$(this).removeClass("library__item--active");
	});

});