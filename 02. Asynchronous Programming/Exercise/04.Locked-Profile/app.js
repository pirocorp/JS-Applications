async function lockedProfile() {
    const mainElement = document.getElementById('main')

    const response = await fetch('http://localhost:3030/jsonstore/advanced/profiles');
    const data = await response.json();

    mainElement.innerHTML = '';

    for (const key in data) {
        const profile = data[key];
        
        mainElement.appendChild(createProfileElement(profile));
    }
}

function createProfileElement (profile) {
    const profileButtonElement = createDOMElement('button', {}, 'Show more');
    const hiddenInformation = createDOMElement(
        'div', 
        {id: "user1HiddenFields"},
        createDOMElement('hr', {}),
        createDOMElement('label', {}, 'Email: '),
        createDOMElement('input', {type: 'email', name:`${profile._id}Email`, value: profile.email, disabled: true, readonly: true}),
        createDOMElement('label', {}, 'Age: '),
        createDOMElement('input', {type: 'number', name:`${profile._id}Age`, value: profile.age, disabled: true, readonly: true}));

    const profileElement = createDOMElement(
        'div',
        {classList: 'profile' },
        createDOMElement('img', {src: './iconProfile2.png', classList: 'userIcon'}),
        createDOMElement('label', {htmlFor: `${profile._id}Locked`}, 'Lock '),
        createDOMElement('input', {type: 'radio', name:`${profile._id}Locked`, id:`${profile._id}Locked`, value: 'lock', checked: true }),
        createDOMElement('label', {htmlFor: `${profile._id}Unlocked`}, 'Unlock '),
        createDOMElement('input', {type: 'radio', name:`${profile._id}Locked`, id:`${profile._id}Unlocked`, value: 'unlock' }),
        createDOMElement('hr', {}),
        createDOMElement('label', {}, 'Username'),
        createDOMElement('input', {type: 'text', name: `${profile._id}Username`, value: profile.username, disabled: true, readonly: true}),
        hiddenInformation,
        profileButtonElement);

    let isShow = true;
    profileButtonElement.addEventListener('click', onProfileButtonClickHandler.bind(profileElement))

    function onProfileButtonClickHandler(event) {
        const button = event.target;
        const isLocked = this.querySelector('input[type="radio"]:checked').value === 'lock';
        
        if(isLocked){
            return
        }
    
        console.log(isShow);
    
        if(isShow) {
            button.textContent = 'Hide it';
            hiddenInformation.style.display = 'block';
        }else {
            button.textContent = 'Show more';
            hiddenInformation.style.display = 'none';
        }
    
        isShow = !isShow;
    }

    return profileElement;
}

function createDOMElement(type, attr, ...content) {
    const element = document.createElement(type);       

    Object.assign(element, attr);

    for (let item of content) {
        if(typeof(item) === 'string' 
        || typeof(item) === 'number') {
            item = document.createTextNode(item);
        }

        element.appendChild(item);
    }

    return element;
};