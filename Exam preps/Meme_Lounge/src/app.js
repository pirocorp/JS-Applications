import userService from './services/usersService.js';

import { createGuestUsersOnlyMiddleware } from './infrastructure/pageMiddlewares.js';
import { page, render } from './lib.js';

import { catalogPage } from './views/catalog.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { profilePage } from './views/profile.js';

const root = document.querySelector('main');

document.getElementById('logout-btn').addEventListener('click', onLogoutButtonClickEventHandler)

page(decorateContext);

const guestUsersOnly = createGuestUsersOnlyMiddleware('/memes');

page('/', guestUsersOnly, homePage);
page('/memes', catalogPage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/profile', profilePage);

updateUserNav();
page.start();


function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;

    next();
}

function onLogoutButtonClickEventHandler() {
    userService.logout();

    updateUserNav();
}

function updateUserNav() {
    if(userService.isAuthenticated()) {
        document.querySelector('.user').style.display = 'block';
        document.querySelector('.guest').style.display = 'none';

        document.querySelector('.user span').textContent = `Welcome, ${userService.getCurrentUser().email}`;
    } else {
        document.querySelector('.user').style.display = 'none';
        document.querySelector('.guest').style.display = 'block';
    }
}

