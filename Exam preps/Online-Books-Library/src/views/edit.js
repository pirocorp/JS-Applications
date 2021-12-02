import { createDomElement } from '../infrastructure/domUtilities.js';
import { html } from '../lib.js';
import booksService from '../services/booksService.js';

const editTemplate = (book, onSubmit) => html`
<section id="edit-page" class="edit">
    <form @submit=${onSubmit} id="edit-form">
        <fieldset>
            <legend>Edit my Book</legend>
            <p class="field">
                <label for="title">Title</label>
                <span class="input">
                    <input type="text" name="title" id="title" value=${book.title}>
                </span>
            </p>
            <p class="field">
                <label for="description">Description</label>
                <span class="input">
                    <textarea name="description" id="description">${book.description}</textarea>
                </span>
            </p>
            <p class="field">
                <label for="image">Image</label>
                <span class="input">
                    <input type="text" name="imageUrl" id="image" value=${book.imageUrl}>
                </span>
            </p>
            <p class="field">
                <label for="type">Type</label>
                <span class="input">
                    <select id="type" name="type" value=${book.type}>
                        ${getTypes(book.type)}
                    </select>
                </span>
            </p>
            <input class="button submit" type="submit" value="Save">
        </fieldset>
    </form>
</section>`;

export async function editPage(ctx) {
    const bookId = ctx.params.id;
    const response = await booksService.getById(bookId);

    if(!response.success) {
        return
    }

    const book = response.data;

    ctx.render(editTemplate(book, onEditFormSubmitEventHandler));

    async function onEditFormSubmitEventHandler(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        const imageUrl = formData.get('imageUrl').trim();
        const type = formData.get('type').trim();

        if(title == '' || description == '' || imageUrl == '' || type == '') {
            window.alert('All fields are required.');
            return
        }

        const payload = {
            title,
            description,
            imageUrl,
            type
        };

        const response = await booksService.edit(bookId, payload);

        if(!response.success) {
            return
        }

        event.target.reset();
        ctx.page.redirect(`/details/${book._id}`);
    }
};

function getTypes(selected) {
    const types = ["Fiction", "Romance", "Mistery", "Classic", "Other"];

    return types.map(t => createDomElement('option', {value: t, selected: selected == t}, t))
}