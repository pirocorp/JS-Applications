import { html, render } from "./node_modules/lit-html/lit-html.js";

document.querySelector('form').addEventListener('submit', onFormSubmitEventHandler);
const root = document.getElementById('root');

function onFormSubmitEventHandler(event) {
    event.preventDefault();
    const towns = document.getElementById('towns').value.split(',').map(x => x.trim());
    
    const result = listTemplate(towns);
    render(result, root);
}

const listTemplate = (towns) => html`
<ul>
    ${towns.map(t => html`<li>${t}</li>`)}
</ul>`;