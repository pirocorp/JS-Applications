import usersService from '../services/usersService.js';

const section = document.getElementById('register-page')
section.remove();

const registerFormElement = section.querySelector('form');
registerFormElement.addEventListener('submit', onRegisterFormSubmitHandler);

let ctx;

export async function showRegisterPage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
}

async function onRegisterFormSubmitHandler(event) {
    event.preventDefault();
    const formData = new FormData(registerFormElement);

    const email = formData.get('email').trim();
    const password = formData.get('password').trim();
    const repeatPassword = formData.get('repeatPassword').trim();

    if(!email || !password) {
        alert('All fields are required');
        return
    }

    if(password != repeatPassword) {
        alert('Passwords don\'t match');
        return
    }

    const data = {
        email,
        password
    };

    const response = await usersService.register(data);

    if(!response.success) {
        alert(response.data);
        return
    }

    registerFormElement.reset();
    ctx.goTo('home');
    ctx.updateNav();
}