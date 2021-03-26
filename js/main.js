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
	modalCart = document.querySelector('#modal-cart'),
	more = document.querySelector('.more'),
	navigationLink = document.querySelectorAll('.navigation-link'),
	longGoodsList = document.querySelector('.long-goods-list'),
	btnAccessor = document.querySelector('.card-1  .button'),
	btnClothing = document.querySelector('.card-2  .button'),
	cartTableGoods = document.querySelector('.cart-table__goods'),
	cardTableTotal = document.querySelector('.card-table__total'),
	cartCount = document.querySelector('.cart-count');



const getGoods = async () => {
	const result = await fetch('db/db.json');

	if (!result.ok) {
		throw 'Error :(' + result.status
	}

	return await result.json();
};

const cart = {
	cartGoods: [],
	getCartCountGoods() {
		return this.cartGoods.length;
	},
	renderCart() {
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
		                <td>${name}</td>
						<td>${price}</td>
						<td><button class="cart-btn-minus">-</button></td>
						<td>${count}</td>
						<td><button class="cart-btn-plus">+</button></td>
						<td>${price * count}$</td>
						<td><button class="cart-btn-delete">x</button></td> 
		   `;

			cartTableGoods.append(trGood);
		});

		this.calcCartCount();

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			const { price, count } = item;
			return sum + price * count;
		}, 0);

		cardTableTotal.textContent = `${totalPrice}$`;

	},
	deleteGood(id) {
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	minusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id)
				} else {
					item.count--;
				}
				break;
			}
		}

		this.renderCart();
	},
	plusGood(id) {
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}

		this.renderCart();
	},
	addCartGoods(id) {
		const goodItem = this.cartGoods.find(item => item.id === id);

		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({ id, name, price }) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
					this.calcCartCount()
				});
		}
	},
	calcCartCount() {
		const totalGoods = this.cartGoods.reduce((sum, item) => {

			return sum + item.count;
		}, 0);

		cartCount.textContent = totalGoods ? totalGoods : '';
	},
	clearCart() {
		this.cartGoods.length = 0;
		this.calcCartCount();
		this.renderCart();
	}
};

modalCart.addEventListener('click', event => {
	if (event.target.classList.contains('btn-clear-cart')) {
		cart.clearCart();
	}
})


document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');

	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id);
	}
})

cartTableGoods.addEventListener('click', event => {
	const target = event.target;

	if (target.tagName === "BUTTON") {
		const id = target.closest('.cart-item').dataset.id;

		if (target.classList.contains('cart-btn-delete')) {
			cart.deleteGood(id);
		}

		if (target.classList.contains('cart-btn-minus')) {
			cart.minusGood(id);
		}

		if (target.classList.contains('cart-btn-plus')) {
			cart.plusGood(id);
		}

	}


})


const openModal = () => {
	cart.renderCart();
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


more.addEventListener('click', event => {
	event.preventDefault();

	getGoods().
		then(renderCards);

	scroll(event.target);
});

const filterCard = (field, value) => {
	getGoods()
		.then(data => {
			const filteredGoods = data.filter(good => good[field] === value);

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

		filterCard(field, value);
	})
})

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

// form

const modalForm = document.querySelector('.modal-form');

const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
});

const validForm = (formData) => {
	let valid = false;

	for (const [, value] of formData) {
		if (value.trim()) {
			valid = true;
		} else {
			valid = false;
			break;
		}
	}

	return valid;
}

modalForm.addEventListener('submit', event => {
	event.preventDefault();

	const formData = new FormData(modalForm);

	if (validForm(formData) && cart.getCartCountGoods()) {

		formData.append('cart', JSON.stringify(cart.cartGoods));

		postData(formData)
			.then(resposne => {
				if (!resposne.ok) {
					throw new Error(resposne.status);
				}

				alert('Your order has been shipped. You will be called soon');
			})
			.catch(error => {
				alert('Error :(');
				console.error(error);
			})
			.finally(() => {
				closeModal();
				modalForm.reset();
				cart.clearCart();
			})
	} else {
		if (!validForm(formData)) {
			alert('Fill in the fields correctly');
		}

		if (!cart.getCartCountGoods()) {
			alert('Add items to cart');
		}
	}



})


