import memeService from '../services/memesService.js';

import { showNotification } from '../infrastructure/ui.js';
import { html } from '../lib.js';
import userService from '../services/usersService.js';

const detailsTemplate = (meme, isOwner, onDelete) => html`
<section id="meme-details">
    <h1>Meme Title: ${meme.title}</h1>
    <div class="meme-details">
        <div class="meme-img">
            <img alt="meme-alt" src="${meme.imageUrl}">
        </div>
        <div class="meme-description">
            <h2>Meme Description</h2>
            <p>${meme.description}</p>

            <!-- Buttons Edit/Delete should be displayed only for creator of this meme  -->
            ${ isOwner 
                ? html`
                    <a class="button warning" href="/edit/${meme._id}">Edit</a>
                    <button @click=${onDelete} class="button danger">Delete</button>`
                : null }            
        </div>
    </div>
</section>`;

export async function detailsPage(ctx) {
    const memeId = ctx.params.id;
    const response = await memeService.getById(memeId);
    
    if(!response.success) {
        showNotification(response.data);
        return
    }

    const meme = response.data
    const isOwner = userService.isAuthenticated() && meme._ownerId == userService.getUserId();

    ctx.render(detailsTemplate(meme, isOwner, onDeleteButtonClickEventHandler));

    async function onDeleteButtonClickEventHandler() {
        const choice = confirm('Are you sure you want to delete this meme?');

        if(choice) {
            await memeService.delete(memeId);
            ctx.page.redirect('/memes');
        }
    }
}
