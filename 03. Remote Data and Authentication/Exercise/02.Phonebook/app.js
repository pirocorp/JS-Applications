function attachEvents() {
    document.getElementById('btnLoad').addEventListener('click', loadContacts);
    document.getElementById('btnCreate').addEventListener('click', onCreate);

    listElement.addEventListener('click', onDeleteClickHandler)

    loadContacts();
}

const listElement = document.getElementById('phonebook');
const personElement = document.getElementById('person');
const phoneElement = document.getElementById('phone');

attachEvents();

async function onDeleteClickHandler(event) {
    const id = event.target.dataset.id;

    if(id != undefined) {
        await deleteContact(id);

        event.target.parentElement.remove();
    }
}

async function onCreate() {
    const person = personElement.value;
    const phone = phoneElement.value;

    let contact = {person , phone};

    contact = await createContact(contact);
    listElement.appendChild(createContactItem(contact));

    personElement.value = '';
    phoneElement.value = '';
}

async function loadContacts() {
    const url = 'http://localhost:3030/jsonstore/phonebook';

    const res = await fetch(url);
    const data = await res.json();

    listElement.replaceChildren(...Object.values(data).map(createContactItem));
}

function createContactItem(contact) {
    const li = document.createElement('li');
    li.innerHTML = `${contact.person}: ${contact.phone} <button data-id="${contact._id}">Delete</button>`;

    return li;
}

async function createContact(contact) {
    const url = 'http://localhost:3030/jsonstore/phonebook';
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact)
    };

    const res = await fetch(url, options);
    const result = res.json();

    return result;
}

async function deleteContact(id) {
    const url = `http://localhost:3030/jsonstore/phonebook/${id}`;
    const options = {
        method: 'delete'
    };

    const res = await fetch(url, options);
    const result = res.json();

    return result;
}