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
	notes:
	* should left arrow be before the carousel content?
	* should carousel loop endlessly?
	* if the carousel item has a set width or max width then multiple items are shown if the container is wide enough
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
		iterationWidth, // width of each animated point
		direction,
		animating = false,
		animationEnd,
		animationDuration = supportsTransitions() ? 1000 : 0, // length of CSS animation
		itemsShown = 1, // number of items shown at one time
		viewing = 0;

	// make the current item visible
	function showCurrent () {
		$carouselItems.removeClass('carousel-item__currently-viewing');
		for (var i = 0; i < itemsShown; i += 1) {
			$carouselItems.eq(viewing + i).addClass('carousel-item__currently-viewing');
		}
	}

	// set widths and heights of wrapper and items
	// for horizontal need to set height before getting widths
	// for vertical need to set widths beofre getting heights
	function setDimensions () {
		var maxWidth = 0;
		// reset dimensions
		$carouselWrapper.width('auto').height('auto');
		$carouselItems.width('').height('auto');
		height = 0;
		// find the highest and widest dimensions
		$carouselItems.each(function () {
			var $el = $(this),
				elHeight = $el.innerHeight(),
				elWidth = $el.innerWidth();
			if (height < elHeight) {
				height = elHeight;
			}
			// this is used to check the maxmum number of items shown at one time in the carousel
			if (maxWidth < elWidth) {
				maxWidth = elWidth;
			}
		});
		// set height
		$carouselItems.height(height);
		$carouselContainer.height(height);
		// set widths
		width = $carouselContainer.width();
		// change viewing if viewing more than currently shown
		if (viewing > $carouselItems.length - itemsShown) {
			viewing = $carouselItems.length - itemsShown;
		}
		// find out margin width (if any) and set container width
		if (direction === 'horizontal') {
			margin = parseFloat($carouselItems.eq(0).css('marginRight'));
			$carouselWrapper.width($carouselItems.length * (width + margin));
		} else if (direction === 'vertical') {
			margin = parseFloat($carouselItems.eq(0).css('marginBottom'));
			$carouselWrapper.height($carouselItems.length * (height + margin));
		}
		// how many carousel items visible at one point
		itemsShown = parseInt(($carouselContainer.width()) / (maxWidth + margin), 10);
		// $('.debug').text($('.debug').text() + ' ' + $carouselContainer.width() + ' ' + (maxWidth + margin))
		if (!itemsShown) {
			itemsShown = 1; // in case CSS breaks and this is 0
		}
		// set the width of each item to fill the carousel container
		// width less (margin times (items shown less 1) divided by items shown
		iterationWidth = (width - (margin * (itemsShown - 1)))  / itemsShown;
		$carouselItems.width(iterationWidth);
	}

	// add/remove disabled class from arrows
	function updateClasses (previousPosition) {
		// $('.debug').text('viewing :' + viewing + ' prev: ' + previousPosition)
		if (viewing === 0) {
			prev.className = prev.className + ' carousel-button__disabled';
		} else if (viewing === $carouselItems.length - itemsShown) {
			next.className = next.className + ' carousel-button__disabled';
		}
		if (previousPosition === 0) {
			prev.className = prev.className.replace(' carousel-button__disabled', '');
		} else if (previousPosition === $carouselItems.length - itemsShown) {
			next.className = next.className.replace(' carousel-button__disabled', '');
		}
		// update quick links
		$quickLinks.removeClass('carousel__quick-link-viewing');
		$quickLinks.eq(viewing).addClass('carousel__quick-link-viewing');
	}

	// move the carousel
	function animate (previousPosition) {
		animating = true;
		showCurrent();
		// make all items visible when animating
		$carousel.addClass('carousel__animating');
		clearTimeout(animationEnd);
		// wait for animation to end
		animationEnd = setTimeout(function () {
			animating = false;
			$carousel.removeClass('carousel__animating');
		}, animationDuration);
		updateClasses(previousPosition);
		// $('.debug').text(iterationWidth)
		// $('.debug').text((width / itemsShown) + margin + '/' + $carouselContainer.width() + '/' + width)
		if (direction === 'horizontal') {
			$carouselWrapper[0].style.left = (-1 * viewing * (iterationWidth + margin)) + 'px';
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

		viewing += positionChange;
		if (viewing === -1 || viewing === $carouselItems.length - (itemsShown - 1)) {
			viewing = previousPosition;
			return;
		}
		animate(previousPosition);
	}

	// add buttons to the carousel
	function createButton (classname, href, index) {
		var button = document.createElement('a');
		button.href = href || '#';
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
		e.preventDefault();
		var previousPosition = viewing;
		viewing = e.currentTarget.position;
		animate(previousPosition);
	}
	function setQuickLinksShown() {
		$quickLinks.removeClass('hidden');
		if (itemsShown > 1) {
			for (var i = 1; i < itemsShown; i += 1) {
				$quickLinks.eq($quickLinks.length - i).addClass('hidden');
			}
		}
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
		setQuickLinksShown();
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

	// window resize events
	var endOfReset;
	function resize () {
		setDimensions();
		animate();
		setQuickLinksShown();
		// disable animations when resetting
		$carousel.addClass('carousel-reset');
		clearTimeout(endOfReset);
		endOfReset = setTimeout(function () {
			$carousel.removeClass('carousel-reset');
		}, 500);
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
		addButtons();
		addQuickLinks();
		showCurrent();
		updateClasses();
		arrowNavigation();
		// viewport change events
		$(window).resize(resize);
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