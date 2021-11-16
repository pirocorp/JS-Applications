import userService from './services/usersService.js';

import { showHome } from "./home.js";
import { showLogin } from "./login.js";
import { showRegister } from "./register.js";

const navElement = document.querySelector('nav');
navElement.addEventListener('click', onNavElementClickHandler);

const logoutButtonElement = document.getElementById('logoutBtn');
logoutButtonElement.addEventListener('click', onLogoutButtonClickHandler);

const navigationViews = {
    'homeLink': showHome,
    'loginLink': showLogin,
    'registerLink': showRegister,
};

function onNavElementClickHandler(event) {
    if(event.target.tagName == 'A') {
        const view = navigationViews[event.target.id];

        if(typeof view == 'function') {
            event.preventDefault();
            view();
        }
    }
};

async function onLogoutButtonClickHandler(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    await userService.logout();
    
    updateNav();
    showLogin();
}

export function updateNav() {
    const userElements = Array.from(navElement.querySelectorAll('.user'));
    const guestElements = Array.from(navElement.querySelectorAll('.guest'));

    if(userService.isAuthenticated()) {
        userElements.forEach(e => e.style.display = 'block');
        guestElements.forEach(e => e.style.display = 'none');

        const userData = userService.getCurrentUser();        
        navElement.querySelector('#welcomeMsg').textContent = `Wellcome, ${userData.email}`;
    } else {
        userElements.forEach(e => e.style.display = 'none');
        guestElements.forEach(e => e.style.display = 'block');
    }    
}

/* Test for DI ctx */
const ctx = {
    updateNav,
    goTo,
    showView // from dom
}

const views = {
    'home': showHome,
    'login': showLogin,
    'register': showRegister
}

const links = {
    'homeLink': 'home',
    'loginLink': 'login',
    'registerLink': 'register',
}

function onNavElementClickHandler2(event) {
    if(event.target.tagName == 'A') {
        const name = links[event.target.id];

        if(name) {
            event.preventDefault();
            goTo(name);
        }
    }
};

function goTo(viewName, ...params) {
    const view = views[viewName];

    if(typeof view == 'function') {
        
        view(ctx, ...params);
    }
}