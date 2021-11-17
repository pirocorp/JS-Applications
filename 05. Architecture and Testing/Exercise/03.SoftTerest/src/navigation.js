import userService from "./services/usersService.js"

import { showCatalogPage } from "./views/catalog.js"
import { showCreatePage } from "./views/create.js"
import { showDetailsPage } from "./views/details.js"
import { showHomePage } from "./views/home.js"
import { showLoginPage } from "./views/login.js"
import { showRegisterPage } from "./views/register.js"

const links = {
    'home-link': 'home',
    'catalog-link': 'catalog',
    'login-link': 'login',
    'logout-btn': 'logout',
    'register-link': 'register',
    'create-link': 'create',
};

const views = {
    'home': showHomePage,
    'catalog': showCatalogPage,
    'login': showLoginPage,
    'register': showRegisterPage,
    'create': showCreatePage,
    'details': showDetailsPage,
    'logout': logout,
};

const navElement = document.querySelector('nav');
const main = document.querySelector('main');

const showSection = (section) => main.replaceChildren(section);

const ctx = {
    goTo,
    showSection,
    updateNav
}

export function setUpNavigation() {    
    navElement.addEventListener('click', onNavElementClickHandler);
}

async function onNavElementClickHandler(event) {
    const name = links[event.target.id];

    if(name) {
        event.preventDefault();
        await goTo(name);
    }
};

export async function goTo(name, ...params) {
    const view = views[name];

    if(typeof view == 'function') {
        await view(ctx, ...params)
    }
}

export function updateNav() {
    const userLinks = Array.from(navElement.querySelectorAll('.user'));
    const guestLinks = Array.from(navElement.querySelectorAll('.guest'));

    if(userService.isAuthenticated()) {
        userLinks.forEach(l => l.style.display = 'block');
        guestLinks.forEach(l => l.style.display = 'none');
    } else {
        userLinks.forEach(l => l.style.display = 'none');
        guestLinks.forEach(l => l.style.display = 'block');
    }
}

async function logout() {
    const response = await userService.logout();

    if(response.success) {
        updateNav();
        await goTo('home')
    }
}

