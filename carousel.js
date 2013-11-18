// simple check for transitions support, remove if using modernizr
function supportsTransitions() {
	var b = document.body || document.documentElement,
		s = b.style;
	if (typeof s['transition'] === 'string' || typeof s['Webkittransition'] === 'string') {
		return true;
	}
	return false;
}
/* 
	considerations:
	* should left arrow be before the carousel content?
*/

var Carousel = function (index, el) {
	'use strict';
	var $carousel,
		$carouselContainer,
		$carouselWrapper,
		$carouselItems,
		$quickLinks,
		prev,
		next,
		width,
		height,
		margin,
		direction,
		animating = false,
		animatingDirection,
		animationEnd,
		animationDuration = supportsTransitions() ? 1000 : 0, // length of CSS animation
		viewing = 0;

	// make the current item visible
	function showCurrent () {
		$carouselItems.eq(viewing).addClass('carousel-item__currently-viewing');
	}
	function removePrevious (previousPosition) {
		$carouselItems.eq(previousPosition).removeClass('carousel-item__currently-viewing');
	}

	// set widths and heights of wrapper and items
	// for horizontal need to set height before getting widths
	// for vertical need to set widths beofre getting heights
	function setDimensions () {
		// set height
		height = 0;
		$carouselItems.height('auto');
		$carouselItems.each(function () {
			var elHeight = $(this).innerHeight();
			if (height < elHeight) {
				height = elHeight;
			}
		});
		$carouselItems.height(height);
		$carouselContainer.height(height);
		// set widths
		width = $carouselContainer.width();
		$carouselItems.width(width);

		if (direction === 'vertical') {
			margin = parseFloat($carouselItems.eq(0).css('marginBottom'));
			$carouselWrapper.height($carouselItems.length * (height + margin));
		} else if (direction === 'horizontal') {
			margin = parseFloat($carouselItems.eq(0).css('marginRight'));
			$carouselWrapper.width($carouselItems.length * (width + margin));
		}
	}

	// add/remove disabled class from arrows
	function updateClasses () {
		if (viewing === 0) {
			prev.className = prev.className + ' carousel-button__disabled';
			next.className = next.className.replace(' carousel-button__disabled', '');
		} else if (viewing === $carouselItems.length - 1) {
			prev.className = prev.className.replace(' carousel-button__disabled', '');
			next.className = next.className + ' carousel-button__disabled';
		} else {
			prev.className = prev.className.replace(' carousel-button__disabled', '');
			next.className = next.className.replace(' carousel-button__disabled', '');
		}
		$quickLinks.removeClass('carousel__quick-link-viewing');
		$quickLinks.eq(viewing).addClass('carousel__quick-link-viewing');
	}

	// move the carousel
	function animate (previousPosition) {
		animating = true;
		showCurrent();
		$carousel.addClass('carousel__animating');
		// wait for animation to end
		animationEnd = setTimeout(function () {
			removePrevious(previousPosition);
			animating = false;
			$carousel.removeClass('carousel__animating');
		}, animationDuration);
		updateClasses();
		if (direction === "horizontal") {
			$carouselWrapper[0].style.left = (-1 * viewing * (width + margin)) + 'px';
		} else {
			$carouselWrapper[0].style.top = (-1 * viewing * (height + margin)) + 'px';
		}
	}

	// move the carousel
	function move (e, dir) {
		e.preventDefault();
		var previousPosition = viewing,
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
			viewing = previousPosition;
			return;
		}
		animate(previousPosition);
	}

	// add buttons to the carousel
	function createButton (classname, href, index) {
		var button = document.createElement('a');
		button.href = href || "#";
		button.className = classname;
		if (index !== undefined) {
			button.position = index;
		}
		return button;
	}
	function addButtons () {
		prev = createButton('carousel-prev');
		prev.direction = -1;
		$(prev).on('click', move);
		next = createButton('carousel-next');
		next.direction = 1;
		$(next).on('click', move);
		$carousel.append(prev, next);
	}
	function quickLink (e) {
		var previousPosition = viewing;
		viewing = e.currentTarget.position;
		animate(previousPosition);
	}
	function addQuickLinks () {
		var div = document.createElement('div');
		div.className = 'carousel__quick-links';
		$carouselItems.each(function (index) {
			var icon = createButton('carousel__quick-link', '#', index);
			div.appendChild(icon);
		});
		$carousel.append(div);
		$quickLinks = $carousel.find('.carousel__quick-link');
		$quickLinks.on('click', quickLink);
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
		direction = $carousel.data('direction');
		$carouselContainer.attr('tabindex', 0);
		$carousel.addClass('carousel-init');
		setDimensions();
		$(window).resize(function () {
			setDimensions();
			animate();
		});
		addButtons();
		addQuickLinks();
		showCurrent();
		updateClasses();
		arrowNavigation();
	}
	return init(el);
};

if(!window.jQuery) {
	var s = document.createElement('script');
	s.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js');
	s.setAttribute('type', 'text/javascript');
	document.getElementsByTagName('body')[0].appendChild(s);
	s.onload = function () {
		$('.carousel').each(Carousel);
	};
	// IE8
	s.onreadystatechange = function () {
		if (document.readyState === 'complete') {
			$('.carousel').each(Carousel);
		}
	};
}