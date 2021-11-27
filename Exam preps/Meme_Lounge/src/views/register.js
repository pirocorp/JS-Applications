import userService from '../services/usersService.js';

import { html } from '../lib.js';
import { showNotification } from '../infrastructure/ui.js';

const registerTemplate = (onSubmit) => html`
<section id="register">
    <form @submit=${onSubmit} id="register-form">
        <div class="container">
            <h1>Register</h1>
            <label for="username">Username</label>
            <input id="username" type="text" placeholder="Enter Username" name="username">
            <label for="email">Email</label>
            <input id="email" type="text" placeholder="Enter Email" name="email">
            <label for="password">Password</label>
            <input id="password" type="password" placeholder="Enter Password" name="password">
            <label for="repeatPass">Repeat Password</label>
            <input id="repeatPass" type="password" placeholder="Repeat Password" name="repeatPass">
            <div class="gender">
                <input type="radio" name="gender" id="female" value="female">
                <label for="female">Female</label>
                <input type="radio" name="gender" id="male" value="male" checked>
                <label for="male">Male</label>
            </div>
            <input type="submit" class="registerbtn button" value="Register">
            <div class="container signin">
                <p>Already have an account?<a href="/login">Sign in</a>.</p>
            </div>
        </div>
    </form>
</section>`;

export function registerPage(ctx) {
    ctx.render(registerTemplate(onRegisterFormSubmitEventHandler));

    async function onRegisterFormSubmitEventHandler(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const email = formData.get('email').trim();
        const username = formData.get('username').trim();
        const password = formData.get('password').trim();
        const repeatPass = formData.get('repeatPass').trim();
        const gender = formData.get('gender').trim();

        if(email == '' || username == '' || password == '' || gender == '') {
            showNotification('All fields are required.');
            return
        }

        if(password != repeatPass) {
            showNotification('Passwords don\'t match');
            return
        }

        const payload = {
            email,
            username,
            password,
            gender
        };

        const response = await userService.register(payload);

        if(!response.success) {
            showNotification(response.data);
            return
        }

        ctx.updateUserNav();
        ctx.page.redirect('/memes');
    }
}
