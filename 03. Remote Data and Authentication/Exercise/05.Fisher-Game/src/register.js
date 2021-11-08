window.addEventListener('DOMContentLoaded', () => {
    const registerFormElement = document.getElementById('register-form');

    registerFormElement.addEventListener('submit', onRegisterFormSubmitEventHandler);
});

async function onRegisterFormSubmitEventHandler(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('rePass');

    if(password !== confirmPassword) {
        alert('passwords don\'t match');
        return
    }
    
    try {
        const res = await fetch('http://localhost:3030/users/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if(res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }

        const data = await res.json();
        console.log(data);

        const userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        };

        sessionStorage.setItem('userData', JSON.stringify(userData));
        window.location = '/';
    } catch (error) {
        alert(error.message)
    }
}