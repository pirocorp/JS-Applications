import albumsService from '../services/albumsService.js'

import { html } from '../lib.js';
import userService from '../services/usersService.js';

const catalogTemplate = (albums, isGuest) => html`
<section id="catalogPage">
    <h1>All Albums</h1>

    ${albums.length == 0
        ? html`<p>No Albums in Catalog!</p>`
        : albums.map(a => albumCard(a, isGuest)) }
</section>`;

const albumCard = (album, isGuest) => html`
<div class="card-box">
    <img src=${album.imgUrl}>
    <div>
        <div class="text-center">
            <p class="name">Name: ${album.name}</p>
            <p class="artist">Artist: ${album.artist}</p>
            <p class="genre">Genre: ${album.genre}</p>
            <p class="price">Price: $${album.price}</p>
            <p class="date">Release Date: ${album.releaseDate}</p>
        </div>
        <div class="btn-group">
            ${ isGuest 
                ? null
                : html`<a href="/details/${album._id}" id="details">Details</a>`
            }            
        </div>
    </div>
</div>`;

export async function catalogPage(ctx) {
    const response = await albumsService.getAll();

    if(!response.success) {
        return
    }

    const isGuest = !userService.isAuthenticated();

    ctx.render(catalogTemplate(response.data, isGuest));
}