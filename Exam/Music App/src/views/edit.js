import albumsService from '../services/albumsService.js'
import { html } from '../lib.js';

const editTemplate = (album, onSubmit) => html`
<section class="editPage">
    <form @submit=${onSubmit}>
        <fieldset>
            <legend>Edit Album</legend>

            <div class="container">
                <label for="name" class="vhide">Album name</label>
                <input id="name" name="name" class="name" type="text" value=${album.name}>

                <label for="imgUrl" class="vhide">Image Url</label>
                <input id="imgUrl" name="imgUrl" class="imgUrl" type="text" value=${album.imgUrl}>

                <label for="price" class="vhide">Price</label>
                <input id="price" name="price" class="price" type="text" value=${album.price}>

                <label for="releaseDate" class="vhide">Release date</label>
                <input id="releaseDate" name="releaseDate" class="releaseDate" type="text" value=${album.releaseDate}>

                <label for="artist" class="vhide">Artist</label>
                <input id="artist" name="artist" class="artist" type="text" value=${album.artist}>

                <label for="genre" class="vhide">Genre</label>
                <input id="genre" name="genre" class="genre" type="text" value=${album.genre}>

                <label for="description" class="vhide">Description</label>
                <textarea name="description" class="description" rows="10" cols="10">${album.description}</textarea>

                <button class="edit-album" type="submit">Edit Album</button>
            </div>
        </fieldset>
    </form>
</section>`;

export async function editPage(ctx) {
    const albumId = ctx.params.id;

    const albumResponse = await albumsService.getById(albumId);

    if(!albumResponse.success) {
        return
    }

    const album = albumResponse.data;

    ctx.render(editTemplate(album, onEditFormSubmitEventHandler));

    async function onEditFormSubmitEventHandler(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const name = formData.get('name').trim();
        const imgUrl = formData.get('imgUrl').trim();
        const price = formData.get('price').trim();
        const releaseDate = formData.get('releaseDate').trim();
        const artist = formData.get('artist').trim();
        const genre = formData.get('genre').trim();
        const description = formData.get('description').trim();

        if(name == '' 
            || imgUrl == '' 
            || price == '' 
            || releaseDate == ''
            || artist == ''
            || genre == ''
            || description == '') {
            window.alert('All fields are required.');
            return
        }

        const payload = {
            name,
            imgUrl,
            price,
            releaseDate,
            artist,
            genre,
            description
        };
        
        const response = await albumsService.edit(albumId, payload);

        if(!response.success) {
            return
        }

        event.target.reset();
        ctx.page.redirect(`/details/${albumId}`);
    }
}