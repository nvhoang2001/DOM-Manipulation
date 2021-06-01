"use strict";

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const allSection = document.querySelectorAll(".section");
const imgTargets = document.querySelectorAll("img[data-src]");

// Modal window

const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove("hidden");
	overlay.classList.remove("hidden");
};

const closeModal = function () {
	modal.classList.add("hidden");
	overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => {
	btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
	if (e.key === "Escape" && !modal.classList.contains("hidden")) {
		closeModal();
	}
});

///////////////////////////////////

// Button scrolling
btnScrollTo.addEventListener("click", function (e) {
	// const sec1coords = section1.getBoundingClientRect();
	// console.log(sec1coords);
	// // Stuff
	// console.log(e.target.getBoundingClientRect());
	// console.log(
	// 	"Current scroll (X/Y): ",
	// 	window.pageXOffset,
	// 	window.pageYOffset
	// );
	// console.log(
	// 	"height/width viewport: ",
	// 	document.documentElement.clientHeight,
	// 	document.documentElement.clientWidth
	// );
	// Scrolling
	// window.scrollTo(
	// 	sec1coords.left + window.pageXOffset,
	// 	sec1coords.top + window.pageYOffset,
	// );

	// window.scrollBy({
	// 	left: sec1coords.left + window.pageXOffset,
	// 	top: sec1coords.top + window.pageYOffset,
	// 	behavior: "smooth",
	// });

	section1.scrollIntoView({ behavior: "smooth" });
});

// Page navigation

// document.querySelectorAll(".nav__link").forEach(function (el) {
// 	el.addEventListener("click", function (e) {
// 		e.preventDefault();
// 		const id = this.getAttribute("href");
// 		document.querySelector(id).scrollIntoView({ behavior: "smooth" });
// 	});
// });

document.querySelector(".nav__links").addEventListener("click", function (e) {
	e.preventDefault();
	if (e.target.classList.contains("nav__link")) {
		const id = e.target.getAttribute("href");
		document.querySelector(id).scrollIntoView({ behavior: "smooth" });
	}
});

// Tabbed component

tabsContainer.addEventListener("click", function (e) {
	const clicked = e.target.closest(".operations__tab");

	if (!clicked) {
		return;
	}

	// remove active classes
	tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
	tabsContent.forEach((tab) =>
		tab.classList.remove("operations__content--active")
	);

	// Active tab
	clicked.classList.add("operations__tab--active");

	// Active content area
	document
		.querySelector(`.operations__content--${clicked.dataset.tab}`)
		.classList.add("operations__content--active");
});

// Menu fade animation

const hoverHandler = function (e) {
	if (e.target.classList.contains("nav__link")) {
		const link = e.target;
		const siblings = link.closest(".nav").querySelectorAll(".nav__link");
		const logo = link.closest(".nav").querySelector("#logo");

		siblings.forEach((el) => {
			if (el !== link) {
				el.style.opacity = this;
			}
		});

		logo.style.opacity = this;
	}
};

nav.addEventListener("mouseover", hoverHandler.bind(0.5));

nav.addEventListener("mouseout", hoverHandler.bind(1));

// Sticky navigation
// const initialCoords = nav.getBoundingClientRect();

// window.addEventListener("scroll", function (e) {
// 	if (window.scrollY >= initialCoords.bottom) nav.classList.add("sticky");
// 	else nav.classList.remove("sticky");
// });

// Sticky navigation: Intersection Observer API

// const obsCallback = function (entries, observer) {
// 	entries.forEach((entry) => {
// 		console.log(entry);
// 	});
// };

// const obsOption = {
// 	root: null,
// 	threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOption);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
	const [entry] = entries;
	if (entry.isIntersecting) {
		nav.classList.remove("sticky");
	} else {
		nav.classList.add("sticky");
	}
};

const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal section

const revealSection = function (entries, observer) {
	// reveal sections unrepeateadly
	// const [entry] = entries;
	// if (!entry.isIntersecting) {
	// 	entry.target.classList.add("section--hidden");
	// 	return;
	// }
	// entry.target.classList.remove("section--hidden");
	// sectionObserver.unobserve(entry.target);

	// Reveal sections repeateadly
	const [entry] = entries;
	const entryUpperHalf =
		entry.target.offsetTop +
		entry.target.getBoundingClientRect().height / 2;
	if (window.pageYOffset < entryUpperHalf) {
		entry.target.classList.remove("section--hidden");
	} else if (window.pageYOffset > entryUpperHalf) {
		return;
	}
	if (!entry.isIntersecting) {
		entry.target.classList.add("section--hidden");
		return;
	}
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

allSection.forEach((section) => {
	sectionObserver.observe(section);
	section.classList.add("section--hidden");
});

// Lazy-loading image

const loadImg = (entries) => {
	const [entry] = entries;

	if (!entry.isIntersecting) return;

	// Replace src with data-src
	entry.target.src = entry.target.dataset.src;
	entry.target.onload = () => {
		entry.target.classList.remove("lazy-img");
	};
	imgObserver.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
	root: null,
	threshold: 0,
	rootMargin: "20%",
});

imgTargets.forEach((img) => {
	imgObserver.observe(img);
});

// Slider
const slider = () => {
	const sliders = document.querySelectorAll(".slide");
	const btnLeft = document.querySelector(".slider__btn--left");
	const btnRight = document.querySelector(".slider__btn--right");
	const dotsContainer = document.querySelector(".dots");
	let curSlide = 0;
	const maxSlide = sliders.length - 1;
	const goToSlide = (slide) => {
		sliders.forEach((s, index) => {
			s.style.transform = `translateX(${(index - slide) * 100}%)`;
		});
	};
	const createDots = () => {
		sliders.forEach((_, i) => {
			dotsContainer.insertAdjacentHTML(
				"beforeend",
				`<button class="dots__dot" data-slide="${i}"> </button>`
			);
		});
	};

	const activeDot = function (slide) {
		dotsContainer
			.querySelectorAll(".dots__dot")
			.forEach((dot) => dot.classList.remove("dots__dot--active"));
		document
			.querySelector(`.dots__dot[data-slide="${slide}"]`)
			.classList.add("dots__dot--active");
	};

	const init = () => {
		createDots();
		activeDot(0);
		goToSlide(0);
	};

	init();

	// Next slide
	const nextSlide = () => {
		if (curSlide === maxSlide) {
			curSlide = 0;
		} else {
			curSlide++;
		}

		goToSlide(curSlide);
		activeDot(curSlide);
	};

	const prevSlide = () => {
		if (curSlide === 0) {
			curSlide = maxSlide;
		} else {
			curSlide--;
		}

		goToSlide(curSlide);
		activeDot(curSlide);
	};

	btnRight.addEventListener("click", nextSlide);
	btnLeft.addEventListener("click", prevSlide);

	document.addEventListener("keydown", (e) => {
		// if (e.key === "ArrowRight") {
		// 	nextSlide();
		// } else if (e.key === "ArrowLeft") {
		// 	prevSlide();
		// }

		e.key === "ArrowRight" && nextSlide();
		e.key === "ArrowLeft" && prevSlide();
	});

	dotsContainer.addEventListener("click", (e) => {
		if (e.target.classList.contains("dots__dot")) {
			const slide = e.target.dataset.slide;
			curSlide = Number(slide);
			goToSlide(slide);
			activeDot(curSlide);
		}
	});
};

slider();
