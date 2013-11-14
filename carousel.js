if(!window.jQuery) {
	var s = document.createElement('script');
	s.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js');
	s.setAttribute('type', 'text/javascript');
	document.getElementsByTagName('body')[0].appendChild(s);
	s.onload = function () {
		$('.carousel').each(Carousel);
	};
}

/* 
	considerations:
	1 carousel should be accessed by tabs, tab in to first item, tab out to controls (prev/next), then tab to 'dot' links
	2 could use left right arrows to navigate through carousel, do people use keys other than tab/shift+tab? 
	3 no auto play
	4 prevent tabbing to hidden/off screen content with visibility: hidden rather than tabindex as can control through css
	5 add controls via JS
	6 should left arrow be before the carousel content?
	7 should we cater for moving focus if in carousel item and the arrow is clicked?
*/

var Carousel = function (index, el) {
	'use strict';
	var $carousel,
		$carouselContainer,
		$carouselWrapper,
		$carouselItems,
		prev,
		next,
		width,
		height,
		direction,
		viewing = 0;

	// make the current item visible
	function showCurrent () {
		$carouselItems.eq(viewing).addClass('carousel-item__currently-viewing');
	}
	function removePrevious (prev) {
		$carouselItems.eq(prev).removeClass('carousel-item__currently-viewing');
	}

	// set widths and heights of wrapper and items
	function setDimensions () {
		var height = 0;
		$carouselWrapper.width($carouselItems.length * width);
		$carouselItems.width(width);
		$carouselItems.each(function () {
			var elHeight = $(this).height();
			if (height < elHeight) {
				height = elHeight;
			}
		});
		$carouselItems.height(height);
		$carouselContainer.height(height);
		$carousel.addClass('carousel-init');
	}

	// add/remove disabled class from arrows
	function updateClasses () {
		if (viewing === 0) {
			prev.className = prev.className + ' carousel-button__disabled';
		} else if (viewing === $carouselItems.length - 1) {
			next.className = next.className + ' carousel-button__disabled';
		} else if (viewing === 1) {
			prev.className = prev.className.replace(' carousel-button__disabled', '');
		} else if (viewing === $carouselItems.length - 2) {
			next.className = next.className.replace(' carousel-button__disabled', '');
		}
	}

	// move the carousel 
	function move (e) {
		var prev = viewing;
		e.preventDefault();
		viewing += parseFloat(e.target.direction, 10);
		if (viewing === -1 || viewing === $carouselItems.length) {
			viewing = prev;
			return;
		}
		showCurrent();
		$carouselWrapper.css({left: -1 * viewing * width});
		// wait for animation to end
		setTimeout(function () {
			removePrevious(prev);
		}, 1000);
		updateClasses();
	}

	// add buttons to the carousel
	function createButton (classname, href) {
		var button = document.createElement('a');
		button.href = href || "#";
		button.className = classname;
		return button;
	}
		prev = createButton('carousel-prev');
	function addButtons () {
		prev.direction = -1;
		prev.addEventListener('click', move);
		next = createButton('carousel-next');
		next.direction = 1;
		next.addEventListener('click', move);
		$carousel.append(prev, next);
	}

	function init (el) {
		$carousel = $(el);
		$carouselContainer = $carousel.find('.carousel-container');
		$carouselWrapper = $carousel.find('.carousel-wrapper');
		$carouselItems = $carousel.find('.carousel-item');
		width = $carousel.width();
		setDimensions();
		addButtons();
		showCurrent();
		updateClasses();
	}
	return init(el);
};
