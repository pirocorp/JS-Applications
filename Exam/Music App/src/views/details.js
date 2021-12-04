import albumsService from '../services/albumsService.js'
import userService from '../services/usersService.js';

import { html } from '../lib.js';

const detailsTemplate = (album, isCreator, onDelete) => html`
<section id="detailsPage">
    <div class="wrapper">
        <div class="albumCover">
            <img src=${album.imgUrl}>
        </div>
        <div class="albumInfo">
            <div class="albumText">

                <h1>Name: ${album.name}</h1>
                <h3>Artist: ${album.artist}</h3>
                <h4>Genre: ${album.genre}</h4>
                <h4>Price: $${album.price}</h4>
                <h4>Date: ${album.releaseDate}</h4>
                <p>Description: ${album.description}</p>
            </div>

            <!-- Only for registered user and creator of the album-->
            ${ isCreator
                ? html`
                    <div class="actionBtn">
                        <a href="/edit/${album._id}" class="edit">Edit</a>
                        <a @click=${onDelete} href="javascript:void(0)" class="remove">Delete</a>
                    </div>`
                : null
            }
        </div>
    </div>
</section>`;

export async function detailsPage(ctx) {
    const albumId = ctx.params.id;

    const albumResponse = await albumsService.getById(albumId);

    if(!albumResponse.success) {
        return
    }

    const album = albumResponse.data;
    const isCreator = userService.isAuthenticated() && userService.getUserId() == album._ownerId;

    ctx.render(detailsTemplate(album, isCreator, onDeleteButtonClickEventHandler));

    async function onDeleteButtonClickEventHandler() {
        const choice = confirm('Are you sure you want to delete this book?');

        if(choice) {
            await albumsService.delete(albumId);
            ctx.page.redirect('/catalog');
        }
    }
}