if(!window.jQuery) {
	var s = document.createElement('script');
	s.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js');
	s.setAttribute('type', 'text/javascript');
	document.getElementsByTagName('body')[0].appendChild(s);
	s.onload = function () {
		Carousel.init();
	};
}
/* 
	considerations:
	1 carousel should be accessed by tabs, tab in to first item, tab out to controls (prev/next), then tab to 'dot' links
	2 could use left right arrows to navigate through carousel, do people use keys other than tab/shift+tab? 
	3 no auto play
	4 prevent tabbing to hidden/off screen content with visibility: hidden rather than tabindex as can control through css
	5 add controls via JS
*/
var Carousel = (function () {
	'use strict';
	function set (index, el) {
		var $carousel = $(el),
			$carouselWrapper = $carousel.find('.carousel-wrapper'),
			$carouselItems = $carousel.find('.carousel-item'),
			width = $carousel.width();
		$carouselWrapper.width($carouselItems.length * width);
		$carouselItems.width(width);
	}
	function init () {
		$('.carousel').each(set);
	}
	return {
		init: init
	};
})();
