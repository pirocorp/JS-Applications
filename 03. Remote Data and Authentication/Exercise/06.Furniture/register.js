import usersService from './services/usersService.js';

window.addEventListener('DOMContentLoaded', () => {
    const registerFormElement = document.getElementById('register-form');
    registerFormElement.addEventListener('submit', onRegisterFormSubmitEventHandler);
});

async function onRegisterFormSubmitEventHandler(event) {
    event.preventDefault();
    const formElement = event.target;

    const formData = new FormData(formElement);

    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('rePass');

    if(rePass !== password) {
        alert('Passwords did not match=');
        return;
    }

    const result = await usersService.register({email, password});

    if(result.success) {
        window.location = '/';
    } else {
        alert(result.data);
    }
}
