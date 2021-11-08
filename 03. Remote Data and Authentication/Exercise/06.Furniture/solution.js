import usersService from './services/usersService.js';
import furnitureService from './services/furnitureService.js';
import ordersService from './services/ordersService.js';
import { createDomElement } from './services/utilities.js';

window.addEventListener('DOMContentLoaded', () => {
	const loggedUserNavigationElement = document.getElementById('user');
	const guestUserNavigation = document.getElementById('guest');
	const buyButton = document.getElementById('buy-button');
	const allOrdersButton = document.getElementById('all-orders-button');

	if (usersService.isAuthenticated()) {
		loggedUserNavigationElement.style.display = 'inline-block';
		buyButton.style.display = 'block';
		allOrdersButton.style.display = 'block';
	} else {
		guestUserNavigation.style.display = 'inline-block';
	}

	const logoutButtonElement = document.getElementById('logoutBtn');
	logoutButtonElement.addEventListener('click', onLogoutButtonClickHandler);

	buyButton.addEventListener('click', onBuyButtonClickHandler);
	allOrdersButton.addEventListener('click', onAllOrdersButtonClickHandler);

	loadFurniture();
});

async function onAllOrdersButtonClickHandler() {
	const result = await ordersService.getAll();
	const totalElement = document.getElementById('total');
	const ordersElement = document.getElementById('orders');

	if(totalElement.style.display != 'none') {
		totalElement.style.display = 'none';
		return;
	}

	if(!result.success) {
		alert(result.data);
	}

	let products = await furnitureService.getByIds(result.data);
	
	if(products.some(r => !r.success)) {
		alert(products.filter(r => !r.success).map(r => r.data).join('\n'))
	}	

	products = products.map(r => r.data);

	const furiniture = products.map(p => p.name).join(', ');
	const total = products.map(p => p.price).reduce((a, c) => a += parseFloat(c), 0);

	ordersElement.innerHTML = `<p>Bought furniture: <span>${furiniture}</span></p>
	<p>Total price: <span>${total} $</span></p>`

	totalElement.style.display = 'block';
}

async function onBuyButtonClickHandler() {
	const products = Array.from(document.querySelectorAll('table.table tbody input:checked'))
		.map(e => e.parentElement.querySelector('input[type="hidden"]').value);
	
	const result = await ordersService.create(products);

	if(result.some(r => !r.success)) {
		alert(result.filter(r => !r.success).map(r => r.data).join('\n'))
	}
}

function onLogoutButtonClickHandler () {
	usersService.logout();
	window.location = '/';
}

async function loadFurniture() {
	const targetElement = document.querySelector('table.table tbody');

	const createRow = (item) => createDomElement(
		'tr', 
		{},
		createDomElement(
			'td',
			{},
			createDomElement('img', {src: item.img})),
		createDomElement(
			'td',
			{},
			createDomElement('p', {}, item.name)),
		createDomElement(
			'td',
			{},
			createDomElement('p', {}, item.price)),
		createDomElement(
			'td',
			{},
			createDomElement('p', {}, item.factor)),
		createDomElement(
			'td',
			{},
			createDomElement('input', {type: 'checkbox', disabled: (!usersService.isAuthenticated())}),
			createDomElement('input', {type: 'hidden', value: item._id})),			
		);

	const response = await furnitureService.getAll();

	if(!response.success) {
		alert(response.data);
		return;
	}

	targetElement.replaceChildren(... response.data.map(createRow))
}