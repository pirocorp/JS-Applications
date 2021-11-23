import { createBook, html, render } from './utilities.js';

const createTemplate = (onSuccess) => html`    
<form @submit=${(event) => onFormSubmitEventHandler(event, onSuccess)} id="add-form">
    <h3>Add book</h3>
    <label>TITLE</label>
    <input type="text" name="title" placeholder="Title...">
    <label>AUTHOR</label>
    <input type="text" name="author" placeholder="Author...">
    <input type="submit" value="Submit">
</form>`;

export function showCreate(ctx) {
    if(ctx.book != undefined) {
        return null;
    }

    return createTemplate(ctx.update);
}

async function onFormSubmitEventHandler(event, onSuccess) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const title = formData.get('title').trim();
    const author = formData.get('author').trim();
    const book = { title, author };

    await createBook(book);
    event.target.reset();
    onSuccess();
}