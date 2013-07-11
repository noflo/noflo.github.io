var UI = {

	"site": {
		"width": document.documentElement.clientWidth, 
		"height": $(".container").height(), 
		"breakpoints": [
			{ "name": "medium", "min": 767 }, 
			{ "name": "small", "min": 0 }
		], 
		"mode": {}
	}, 

	init: function() {

		/**
		* Set up various event listeners
		*/

		/**
		* Site Mode
		*/
		$(window).bind("resize", function() {
			UI.site.width = document.documentElement.clientWidth;
			UI.getSiteMode();

			if(UI.site.mode == "small") {
				UI.resetMobileNav();
			} else {
				UI.resetDesktopNav();
			}

		});
		UI.getSiteMode();

		/**
		* Main Nav 
		*/
		$(".toggle-main-nav").bind("click", function(event) {
			$(this).toggleClass("toggle-menu--open");
			$(".mobile-nav").toggle();
			return false;
		});

		/**
		* Search Bar
		*/
		$(".toggle-search").bind("click", function(event) {
			$(this).toggleClass("toggle-search--active");
			$(".search-form").toggle().toggleClass("search-form--open");
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

		/**
		* Sidebar Extra Content
		*/
		$(".sidebar__show-extra").bind("click", function() {
			$(this).toggleClass("sidebar__show-extra--active")
			$(".sidebar__extra").toggle();
			return false;
		});

	}, 

	getSiteMode: function() {
		for(var i=0, len=UI.site.breakpoints.length; i<len; i++) {
            var breakpoint = UI.site.breakpoints[i];
            if(document.documentElement.clientWidth > breakpoint.min) {
                UI.site.mode = breakpoint.name;
                break;
            }
        }
	},

	resetMobileNav: function() {
		$(".toggle-main-nav").removeClass("toggle-menu--open");
		$(".main-nav").hide();
		UI.resetSearchBar();
	}, 

	resetDesktopNav: function() {
		$(".main-nav").show();
		UI.resetSearchBar();
	}, 

	resetSearchBar: function() {
		$(".toggle-search").removeClass("toggle-search--active");
		$(".search-form").hide();
	}

}

$(document).ready(function() {
	UI.init();
});