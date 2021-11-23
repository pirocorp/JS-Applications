import { html, render } from "./node_modules/lit-html/lit-html.js";

const url = 'http://localhost:3030/jsonstore/advanced/dropdown';

const selectTemplate = (items) => html`
<select id="menu">
    ${items.map(i => html`<option value="${i._id}">${i.text}</option>`)}
</select>
`;

const root = document.querySelector('div');
document.querySelector('form').addEventListener('submit', onFormSubmitHandler);
await start();

function update(items) {
    const result = selectTemplate(items);
    render(result, root);
}

async function getData() {
    const response = await fetch(url);
    const data = await response.json();

    return Object.values(data);
}

async function postData(text) {
    return await fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });
}

async function start() {
    const items = await getData();
    update(items);
}

async function onFormSubmitHandler(event) {
    event.preventDefault();

    const input = document.getElementById('itemText');

    const text = input.value;

    const response = await postData(text);

    if(!response.ok) {
        return;
    }

    input.value = '';
    const items = await getData();
    update(items);
}