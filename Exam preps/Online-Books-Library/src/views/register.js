import userService from '../services/usersService.js';

import { html } from '../lib.js';

const registerTemplate = (onSubmit) => html`
<section id="register-page" class="register">
    <form @submit=${onSubmit} id="register-form" action="" method="">
        <fieldset>
            <legend>Register Form</legend>
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
            <p class="field">
                <label for="repeat-pass">Repeat Password</label>
                <span class="input">
                    <input type="password" name="confirm-pass" id="repeat-pass" placeholder="Repeat Password">
                </span>
            </p>
            <input class="button submit" type="submit" value="Register">
        </fieldset>
    </form>
</section>`;

export async function registerPage(ctx) {
    ctx.render(registerTemplate(onRegisterFormSubmitEventHandler));

    async function onRegisterFormSubmitEventHandler(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const email = formData.get('email').trim();
        const password = formData.get('password').trim();
        const repeatPass = formData.get('confirm-pass').trim();

        if(email == '' || password == '') {
            window.alert('All fields are required.');
            return
        }

        if(password != repeatPass) {
            window.alert('Passwords don\'t match');
            return
        }

        const payload = {
            email,
            password
        };

        const response = await userService.register(payload);

        if(!response.success) {
            window.alert(response.data);
            return
        }

        ctx.updateUserNav();
        ctx.page.redirect('/');
    }
};