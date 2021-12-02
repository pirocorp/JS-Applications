import userService from '../services/usersService.js';

import { html } from '../lib.js';

const loginTemplate = (onSubmit) => html`
<section id="login-page" class="login">
    <form @submit=${ onSubmit } id="login-form" action="" method="">
        <fieldset>
            <legend>Login Form</legend>
            <p class="field">
                <label for="email">Email</label>
                <span class="input">
                    <input type="text" name="email" id="email" placeholder="Email">
                </span>
            </p>
            <p class="field">
                <label for="password">Password</label>
                <span class="input">
                    <input type="password" name="password" id="password" placeholder="Password">
                </span>
            </p>
            <input class="button submit" type="submit" value="Login">
        </fieldset>
    </form>
</section>`;

export async function loginPage(ctx) {
    ctx.render(loginTemplate(onLoginFormSubmitEventHandler));

    async function onLoginFormSubmitEventHandler(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const email = formData.get('email').trim();
        const password = formData.get('password').trim();

        const payload = {
            email,
            password
        };

        if(email == '' || password == '') {
            window.alert('All fields are required.');
            return
        }

        const response = await userService.login(payload);

        if(!response.success) {
            return
        }

        ctx.updateUserNav();
        ctx.page.redirect('/');
    }
};