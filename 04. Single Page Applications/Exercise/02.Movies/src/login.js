import userService from './services/usersService.js';

import { showView } from "./dom.js";
import { showHome } from "./home.js";
import { updateNav } from "./nav.js";

const section = document.getElementById('form-login');
const form = section.querySelector('form');
form.addEventListener('submit', onLogin);

section.remove();

export function showLogin () {
    showView(section);
}

async function onLogin(event) {
    event.preventDefault();

    const formData = new FormData(form);

    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    let response = await userService.login({ email, password });
    
    if(!response.success) {
        alert(response.data);

        return;
    }

    form.reset();
    updateNav();
    await showHome();
}