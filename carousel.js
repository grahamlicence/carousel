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
	function init () {
		console.log('carousel');
	}
	return {
		init: init
	};
})();
Carousel.init();