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
		animating = false,
		animatingDirection,
		animationEnd,
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
		if (direction === 'vertical') {
			$carouselWrapper.height($carouselItems.length * height);
		} else if (direction === 'horizontal') {
			$carouselWrapper.width($carouselItems.length * width);
		}
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
	function move (e, dir) {
		e.preventDefault();
		var prev = viewing,
			attribute,
			positionChange = parseFloat(e.target.direction, 10) || dir;
		// check if there is a direction change during the animation
		if (!animatingDirection) {
			animatingDirection = positionChange;
		} else if (animatingDirection !== positionChange) {
			// we've changed direction and are now going back so don't hide
			clearTimeout(animationEnd);
		}
		animatingDirection = positionChange;
		viewing += positionChange;
		if (viewing === -1 || viewing === $carouselItems.length) {
			viewing = prev;
			return;
		}
		animating = true;
		showCurrent();
		if (direction === "horizontal") {
			$carouselWrapper[0].style.left = (-1 * viewing * width) + 'px';
		} else {
			$carouselWrapper[0].style.top = (-1 * viewing * height) + 'px';
		}
		// wait for animation to end
		animationEnd = setTimeout(function () {
			removePrevious(prev);
			animating = false;
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
	function addButtons () {
		prev = createButton('carousel-prev');
		prev.direction = -1;
		prev.addEventListener('click', move);
		next = createButton('carousel-next');
		next.direction = 1;
		next.addEventListener('click', move);
		$carousel.append(prev, next);
	}

	// allow the carousel to be moved by up/down/left/right arrows
	function arrowNavigation () {
		$carouselContainer.on('keydown', function (e) {
			if (e.keyCode) {
				if (e.keyCode === 37 || e.keyCode === 38) {
					move(e, -1);
				} else if (e.keyCode === 39 || e.keyCode === 40) {
					move(e, 1);
				}
			}
		});
	}

	function init (el) {
		$carousel = $(el);
		$carouselContainer = $carousel.find('.carousel-container');
		$carouselWrapper = $carousel.find('.carousel-wrapper');
		$carouselItems = $carousel.find('.carousel-item');
		width = $carousel.width();
		height = $carousel.height();
		direction = $carousel.data('direction');
		$carouselContainer.attr('tabindex', 0);
		setDimensions();
		addButtons();
		showCurrent();
		updateClasses();
		arrowNavigation();
	}
	return init(el);
};
