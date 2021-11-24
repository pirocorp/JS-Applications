import usersService from '../services/usersService.js';
import { html } from '../lib.js';

// I realy miss ASP. These validations are done with one row of code. 

const registerTemplate = (onSubmit, errorMsg, errors) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Register New User</h1>
        <p>Please fill all fields.</p>
    </div>
</div>
<form @submit=${onSubmit}>
    <div class="row space-top">
        <div class="col-md-4">
            ${errorMsg ? html`<div class="form-group error">${errorMsg}</div>` : null}  
            <div class="form-group">
                <label class="form-control-label" for="email">Email</label>
                <input class=${'form-control' + (errors.email ? ' is-invalid' : '')} id="email" type="text" name="email">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="password">Password</label>
                <input class=${'form-control' + (errors.password ? ' is-invalid' : '')} id="password" type="password" name="password">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="rePass">Repeat</label>
                <input class=${'form-control' + (errors.rePass ? ' is-invalid' : '')} id="rePass" type="password" name="rePass">
            </div>
            <input type="submit" class="btn btn-primary" value="Register" />
        </div>
    </div>
</form>`;

export function registerPage(ctx) {
    update({});

    function update(error) {
        ctx.render(registerTemplate(onFormSubmitEventHandler, error.errorMsg, error.errors ?? {}));
    }    

    async function onFormSubmitEventHandler(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const email = formData.get('email').trim();
        const password = formData.get('password').trim();
        const rePass = formData.get('rePass').trim();

        let error = validateInput(email, password, rePass);

        if(error) {
            update(error);
            return
        }

        const payload = {
            email,
            password
        };

        const response = await usersService.register(payload);

        if(!response.success) {
            update({
                errorMsg: response.data,
                errors: {
                    email: true,
                }
            });
            return
        }

        event.target.reset();
        ctx.updateUserNav();
        ctx.page.redirect('/');
    }
}

function validateInput(email, password, rePass) {
    if(email == '' || password == '') {
        return {
            errorMsg: 'All fields are required.',
            errors: {
                email: email == '',
                password: password == '',
                rePass: rePass == ''
            }
        };
    }

    if(password != rePass) {
        return {
            errorMsg: 'Passwords don\'t match.',
            errors: {
                password: true,
                rePass: true
            }
        };
    }
}