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

const scroll = (elem) => {
	let id = elem.getAttribute('href');

	if (id === null || id === '#') {
		id = '#body'
	}

	document.querySelector(id).scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	})
}

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
			scroll(item);
		})
	});

}


// goods

const more = document.querySelector('.more'),
	navigationLink = document.querySelectorAll('.navigation-link'),
	longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async () => {
	const result = await fetch('db/db.json');

	if (!result.ok) {
		throw 'Error :(' + result.status
	}

	return await result.json();
}

// fetch('db/db.json')
// 	.then(response => {
// 		return response.json()
// 	})
// 	.then(data => {
// 		console.log(data)
// 	})

const createCard = ({ description, label, img, name, id, price }) => {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
	                <div class="goods-card">
					    ${label ? `<span class="label">${label}</span>` : ''}
						<img src="db/${img}" alt="${name}" class="goods-image">
						<h3 class="goods-title">${name}</h3>
						<p class="goods-description">${description}</p>
						<button class="button goods-card-btn add-to-cart" data-id="${id}">
							<span class="button-price">${price}</span>
						</button>
					</div>
	`;

	return card;
};

const renderCards = data => {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);

	// cards.forEach(item => {
	// 	longGoodsList.append(item);
	// }
	longGoodsList.append(...cards);

	document.body.classList.add('show-goods')
};


more.addEventListener('click', (event) => {
	event.preventDefault();

	getGoods().
		then(renderCards);

	scroll(event.target);
});

const filterCard = (field, value) => {
	getGoods()
		.then(data => {
			const filteredGoods = data.filter(good => {
				return good[field] === value
			});
			if (filteredGoods.length == 0) {
				return data
			}
			return filteredGoods;
		})
		.then(renderCards);
};

navigationLink.forEach(item => {
	item.addEventListener('click', event => {
		event.preventDefault();

		const field = item.dataset.field;
		const value = item.textContent;
		console.log(field);
		console.log(value);

		filterCard(field, value);
	})
})

const btnAccessor = document.querySelector('.card-1  .button'),
	btnClothing = document.querySelector('.card-2  .button');


const btnClick = (btn, field, value) => {
	filterCard(field, value);
	scroll(btn);
}

btnAccessor.addEventListener('click', () => {
	btnClick(btnAccessor, 'category', 'Accessories');
});

btnClothing.addEventListener('click', () => {
	btnClick(btnClothing, 'category', 'Clothing');
});



