import memeService from '../services/memesService.js';

import { showNotification } from '../infrastructure/ui.js';
import { html } from '../lib.js';

const createTemplate = (onSubmit) => html`
<section id="create-meme">
    <form @submit=${onSubmit} id="create-form">
        <div class="container">
            <h1>Create Meme</h1>
            <label for="title">Title</label>
            <input id="title" type="text" placeholder="Enter Title" name="title">
            <label for="description">Description</label>
            <textarea id="description" placeholder="Enter Description" name="description"></textarea>
            <label for="imageUrl">Meme Image</label>
            <input id="imageUrl" type="text" placeholder="Enter meme ImageUrl" name="imageUrl">
            <input type="submit" class="registerbtn button" value="Create Meme">
        </div>
    </form>
</section>`;

export function createPage(ctx) {
    ctx.render(createTemplate(onCreateFormSubmitEventHandler));

    async function onCreateFormSubmitEventHandler(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const title = formData.get('title').trim();
        const description = formData.get('description').trim();
        const imageUrl = formData.get('imageUrl').trim();

        if(title == '' || description == '' || imageUrl == '') {
            showNotification('All fields are required.');
            return
        }

        const payload = {
            title,
            description, 
            imageUrl
        }

        const response = await memeService.create(payload);

        if(!response.success) {
            showNotification(response.data);
            return
        }

        event.target.reset();
        ctx.page.redirect('/memes');
    }
}
