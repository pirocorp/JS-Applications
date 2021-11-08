import usersService from './services/usersService.js';

window.addEventListener('DOMContentLoaded', () => {
    const registerFormElement = document.getElementById('login-form');
    registerFormElement.addEventListener('submit', onLoginFormSubmitEventHandler);
});

async function onLoginFormSubmitEventHandler(event) {
    event.preventDefault();
    const formElement = event.target;

    const formData = new FormData(formElement);

    const email = formData.get('email');
    const password = formData.get('password');

    const result = await usersService.login({email, password});

    if(result.success) {
        window.location = '/';
    } else {
        alert(result.data);
    }
}