import usersService from './services/usersService.js';

import { page, render } from './lib.js';
import { catalogPage } from './views/catalog.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';

const root = document.querySelector('div.container');
document.getElementById('logoutBtn').addEventListener('click', onLogoutButtonClickHandler)

// decorateContext will be executed before any page handler.
// decorateContext become part of page midleware pipeline.
page(decorateContext);

page('/', catalogPage);
page('/details', detailsPage);
page('/create', createPage);
page('/edit/:id', editPage);
page('/details/:id', detailsPage);
page('/login', loginPage);
page('/register', registerPage);
page('/my-furniture', catalogPage);

page.start();
updateUserNav();

function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.updateUserNav = updateUserNav;

    next();
}

function updateUserNav() {
    if(usersService.isAuthenticated()) {
        document.getElementById('user').style.display = 'inline-block';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'inline-block';
    }
}

async function onLogoutButtonClickHandler() {
    const response = await usersService.logout();

    if(response.success) {
        updateUserNav();
        page.redirect('/');
    }
}