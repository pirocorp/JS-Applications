import { html } from '../lib.js';
import memeService from '../services/memesService.js';
import userService from '../services/usersService.js';

const profileTemplate = (userData, memes) => html`
<section id="user-profile-page" class="user-profile">
            <article class="user-info">
                <img id="user-avatar-url" alt="user-profile" src="/images/female.png">
                <div class="user-content">
                    <p>Username: ${userData.data.username}</p>
                    <p>Email: ${userData.email}</p>
                    <p>My memes count: ${memes.length}</p>
                </div>
            </article>
            <h1 id="user-listings-title">User Memes</h1>
            <div class="user-meme-listings">
                ${ memes.length == 0
                    ? html`<p class="no-memes">No memes in database.</p>`
                    : memes.map(memeCard) }
            </div>
        </section>`;

const memeCard = (meme) => html`
<div class="user-meme">
    <p class="user-meme-title">${meme.title}</p>
    <img class="userProfileImage" alt="meme-img" src=${meme.imageUrl}>
    <a class="button" href="/details/${meme._id}">Details</a>
</div>>`;

export async function profilePage(ctx) {
    const userData = userService.getCurrentUser();
    const response = await memeService.getByOwnerId(userData.id);

    if(!response.success) {
        return
    }
    
    ctx.render(profileTemplate(userData, response.data));
}
