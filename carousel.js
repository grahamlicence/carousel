
// allow forEach on node lists
NodeList.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.forEach = Array.prototype.forEach; // Because of https://bugzilla.mozilla.org/show_bug.cgi?id=14869

var Carousel = function (el) {
	'use strict';
	// keeping the $varName for ease of identifying element references
	var $carousel,
		$carouselContainer,
		$carouselWrapper,
		$carouselItems,
		prev,
		next,
		width,
		height,
		direction,
		animatingDirection,
		animationEnd,
		viewing = 0;

	// make the current item visible
	function showCurrent () {
		$carouselItems[viewing].className = $carouselItems[viewing].className + ' carousel-item__currently-viewing';
	}
	function removePrevious (prev) {
		$carouselItems[prev].className = $carouselItems[prev].className.replace('carousel-item__currently-viewing', '');
	}

	// set widths and heights of wrapper and items
	function setDimensions () {
		height = 0;
		width = $carousel.clientWidth;
		if (direction === 'vertical') {
			$carouselWrapper.style.height = ($carouselItems.length * height) + 'px';
		} else if (direction === 'horizontal') {
			$carouselWrapper.style.width = ($carouselItems.length * width) + 'px';
		}
		$carouselItems.forEach(function (el) {
			el.style.width = width + 'px';
		});
		// reset height and find from new dimensions
		$carouselItems.forEach(function (el) {
			el.style.height = 'auto';
		});
		$carouselItems.forEach(function (el) {
			var elHeight = el.clientHeight;
			if (height < elHeight) {
				height = elHeight;
			}
		});
		$carouselItems.forEach(function (el) {
			el.style.height = height + 'px';
		});
		$carouselContainer.style.height = height + 'px';
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
	function animate () {
		if (direction === "horizontal") {
			$carouselWrapper.style.left = (-1 * viewing * width) + 'px';
		} else {
			$carouselWrapper.style.top = (-1 * viewing * height) + 'px';
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
		showCurrent();
		animate();
		// wait for animation to end
		animationEnd = setTimeout(function () {
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
	function addButtons () {
		prev = createButton('carousel-prev');
		prev.direction = -1;
		prev.addEventListener('click', move);
		next = createButton('carousel-next');
		next.direction = 1;
		next.addEventListener('click', move);
		$carousel.appendChild(prev);
		$carousel.appendChild(next);
	}

	// allow the carousel to be moved by up/down/left/right arrows
	function arrowNavigation () {
		$carouselContainer.addEventListener('keydown', function (e) {
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
		$carousel = el;
		$carouselContainer = $carousel.querySelectorAll('.carousel-container')[0];
		$carouselWrapper = $carousel.querySelectorAll('.carousel-wrapper')[0];
		$carouselItems = $carousel.querySelectorAll('.carousel-item');
		direction = $carousel.dataset.direction;
		$carouselContainer.tabindex = 0;
		setDimensions();
		$carousel.className = $carousel.className + ' carousel-init';
		window.onresize = function () {
			setDimensions();
			animate();
		};
		addButtons();
		showCurrent();
		updateClasses();
		arrowNavigation();
	}
	return init(el);
};

var carousels = document.querySelectorAll('.carousel');
carousels.forEach(function (el, i, a) {
	Carousel(carousels[i]);
});