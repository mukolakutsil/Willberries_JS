const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const buttonCart = document.querySelector('.button-cart'),
	modalCart = document.querySelector('#modal-cart');

const openModal = () => {
	modalCart.classList.add('show');
	document.body.style.overflow = 'hidden';
}

const closeModal = () => {
	modalCart.classList.remove('show');
	document.body.style.overflow = '';

}

buttonCart.addEventListener('click', openModal);

modalCart.addEventListener('click', (event) => {
	const target = event.target;

	if (target.classList.contains('overlay') || target.classList.contains('modal-close')) {
		closeModal()
	}
})

document.addEventListener('keydown', (e) => {
	if (e.code === "Escape" && modalCart.classList.contains('show')) {
		closeModal();
	}
})


// scroll smooth

{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	// for (let i = 0; i < scrollLinks.length; i++) {
	// 	scrollLinks[i].addEventListener('click', (event) => {
	// 		event.preventDefault();
	// 		const id = scrollLinks[i].getAttribute('href');
	// 		document.querySelector(id).scrollIntoView({
	// 			behavior: 'smooth',
	// 			block: 'start'
	// 		})
	// 	})
	// }

	scrollLinks.forEach(item => {
		item.addEventListener('click', (event) => {
			event.preventDefault();
			const id = item.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		})
	});

}
