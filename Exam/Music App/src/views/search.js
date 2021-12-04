import albumsService from '../services/albumsService.js'

import { html } from '../lib.js';
import userService from '../services/usersService.js';

const searchTemplate = (albums, isGuest, onClick) => html`
<section id="searchPage">
    <h1>Search by Name</h1>

    <div class="search">
        <input id="search-input" type="text" name="search" placeholder="Enter desired albums's name">
        <button @click=${onClick} class="button-list">Search</button>
    </div>

    <h2>Results:</h2>

    <!--Show after click Search button-->
    <div class="search-result" style="display:none">
        ${albums.length == 0
            ? html`<p class="no-result">No result.</p>`
            : albums.map(a => albumCard(a, isGuest)) }        
    </div>
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

export async function searchPage(ctx) {
    const isGuest = !userService.isAuthenticated();

    ctx.render(searchTemplate([], isGuest, onSearchButtonClickEventHandler));

    async function onSearchButtonClickEventHandler() {
        const searchElement = document.getElementById('search-input');
        const query = searchElement.value;

        console.log(query);

        const albumsResponse = await albumsService.search(query);

        if(!albumsResponse.success) {
            return
        }

        searchElement.value = '';
        document.querySelector('.search-result').style.display = 'block'
        ctx.render(searchTemplate(albumsResponse.data, isGuest, onSearchButtonClickEventHandler));
    }    
}