function attachEvents() {
    document.getElementById('refresh').addEventListener('click', loadMessages);
    document.getElementById('submit').addEventListener('click', onSubmit);

    loadMessages();
}

const authorElement = document.querySelector('[name="author"]');
const contentElement = document.querySelector('[name="content"]');
const listElement = document.getElementById('messages');

attachEvents();

async function onSubmit() {  
    
    const author = authorElement.value;
    const content = contentElement.value;

    contentElement.value = '';
    await createMessage({author, content});    

    listElement.value += '\n' + `${author}: ${content}` 
}

async function loadMessages() {
    const url = 'http://localhost:3030/jsonstore/messenger';
    const res = await fetch(url);
    const data = await res.json();

    const messages = Object.values(data);
    listElement.value = messages.map(m => `${m.author}: ${m.content}`).join('\n')
}

async function createMessage(message) {
    const url = 'http://localhost:3030/jsonstore/messenger';
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    };

    const res = await fetch(url, options);
    const data = res.json();

    return data;
}