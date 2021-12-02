import userService from './services/usersService.js';

import { page, render } from './lib.js';
import { dashboardPage } from './views/dashboard.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { myBooksPage } from './views/myBooks.js';

const root = document.getElementById('site-content');

document.getElementById('logout-btn').addEventListener('click', onLogoutButtonClickEventHandler);

page(decorateContext);

page('/', dashboardPage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
page('/my-books', myBooksPage);

updateUserNav();
page.start();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;

    next();
}

function updateUserNav() {
    if(userService.isAuthenticated()) {
        document.getElementById('user').style.display = 'block';
        document.getElementById('guest').style.display = 'none';

        document.querySelector('#user span').textContent = `Welcome, ${userService.getCurrentUser().email}`;
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'block';
    }
}

function onLogoutButtonClickEventHandler() {
    userService.logout();

    updateUserNav();
}