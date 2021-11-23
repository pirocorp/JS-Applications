import { html, updateBook } from './utilities.js';

const updateTemplate = (book, ctx) =>  html`
    <form @submit=${ev => onFormSubmitEventHandler(ev, ctx)} id="edit-form">
        <input type="hidden" name="id" .value=${book._id}>
        <h3>Edit book</h3>
        <label>TITLE</label>
        <input type="text" name="title" placeholder="Title..." .value=${book.title}>
        <label>AUTHOR</label>
        <input type="text" name="author" placeholder="Author..." .value=${book.author}>
        <input type="submit" value="Save">
    </form>`;

export function showUpdate(ctx) {
    if(ctx.book == undefined) {
        return null;
    }

    return updateTemplate(ctx.book, ctx);
}

async function onFormSubmitEventHandler(event, ctx) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const id = formData.get('id').trim();
    const title = formData.get('title').trim();
    const author = formData.get('author').trim();
    const book = { title, author };

    await updateBook(id, book);

    event.target.reset();
    delete ctx.book;
    ctx.update();
}