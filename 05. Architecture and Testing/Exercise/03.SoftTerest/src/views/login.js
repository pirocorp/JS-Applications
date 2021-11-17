import usersService from '../services/usersService.js';

const section = document.getElementById('login-page')
section.remove();

const loginFormElement = section.querySelector('form');
loginFormElement.addEventListener('submit', onLoginFormSubmitHandler);

let ctx;

export async function showLoginPage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
}

async function onLoginFormSubmitHandler(event) {
    event.preventDefault();
    const formData = new FormData(loginFormElement);

    const email = formData.get('email').trim();
    const password = formData.get('password').trim();

    const data = {
        email,
        password
    };

    const response = await usersService.login(data);

    if(!response.success) {
        alert(response.data);
        return
    }

    loginFormElement.reset();
    ctx.goTo('home');
    ctx.updateNav();
}