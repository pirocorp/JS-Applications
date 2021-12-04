import userService from './services/usersService.js';

import { page, render } from './lib.js';
import { homePage } from './views/home.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';
import { catalogPage } from './views/catalog.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { createPage } from './views/create.js';
import { searchPage } from './views/search.js';

const root = document.getElementById('main-content');

document.getElementById('logout-btn').addEventListener('click', onLogoutButtonClickEventHandler);

page(decorateContext);

page('/', homePage);
page('/login', loginPage);
page('/register', registerPage);
page('/catalog', catalogPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/search', searchPage);

updateUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;

    next();
}

function updateUserNav() {
    if(userService.isAuthenticated()) {
        Array.from(document.getElementsByClassName('user'))
            .forEach(e => e.style.display = 'inline');

        Array.from(document.getElementsByClassName('guest'))
            .forEach(e => e.style.display = 'none');

    } else {        
        Array.from(document.getElementsByClassName('user'))
            .forEach(e => e.style.display = 'none');
            
        Array.from(document.getElementsByClassName('guest'))
            .forEach(e => e.style.display = 'inline');
    }
}

function onLogoutButtonClickEventHandler() {
    userService.logout();

    updateUserNav();
}