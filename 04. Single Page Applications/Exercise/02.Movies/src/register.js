import userService from "./services/usersService.js";

import { showView } from "./dom.js";
import { showHome } from "./home.js";
import { updateNav } from "./nav.js";

const registerButtonElement = document.querySelector('#form-sign-up button');
registerButtonElement.addEventListener('click', onRegisterButtonClickHandler)

const section = document.getElementById('form-sign-up');
section.remove();

export function showRegister () {
    showView(section);
}

async function onRegisterButtonClickHandler(event) {
    event.preventDefault();

    const formData = new FormData(section.querySelector('form'));

    const email = formData.get('email');
    const password = formData.get('password');
    const repeatPassword = formData.get('repeatPassword');

    if(password != repeatPassword) {
        alert('passwords do not match');
        return
    }

    const data = {
        email,
        password
    };

    const response = await userService.register(data);

    if(!response.success) {
        alert(response.data);
        return
    }

    showHome();
    updateNav();
}