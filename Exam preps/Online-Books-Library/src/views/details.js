import { html } from '../lib.js';

import booksService from '../services/booksService.js';
import likesService from '../services/likesService.js';
import userService from '../services/usersService.js';

const detailsTemplate = (book, isAuthenticated, isOwner, isLiked, likes, onDelete, onLike) => html`
<section id="details-page" class="details">
    <div class="book-information">
        <h3>${book.title}</h3>
        <p class="type">Type: ${book.type}</p>
        <p class="img"><img src=${book.imageUrl}></p>
        <div class="actions">
            <!-- Edit/Delete buttons ( Only for creator of this book )  -->
            ${ isOwner 
                ? html`
                    <a class="button" href="/edit/${book._id}">Edit</a>
                    <a @click=${onDelete} class="button" href="javascript:void(0)">Delete</a>`
                : null }

            <!-- Bonus -->
            <!-- Like button ( Only for logged-in users, which are not creators of the current book ) -->
            ${ !isOwner && isAuthenticated && !isLiked
                ? html`<a @click=${onLike} class="button" href="javascript:void(0)">Like</a>`
                : null }

            <!-- ( for Guests and Users )  -->
            <div class="likes">
                <img class="hearts" src="/images/heart.png">
                <span id="total-likes">Likes: ${likes}</span>
            </div>
            <!-- Bonus -->
        </div>
    </div>
    <div class="book-description">
        <h3>Description:</h3>
        <p>${ book.description }</p>
    </div>
</section>`;

export async function detailsPage(ctx) {
    const bookId = ctx.params.id;
    const userId = userService.getUserId();

    const bookResponse = await booksService.getById(bookId);
    const likesResponse = await likesService.getBookLikes(bookId);
    const bookIsLikedResponse = await likesService.bookIsLikedByUser(bookId, userId);

    if(!bookResponse.success || ! likesResponse.success || !bookIsLikedResponse) {
        return
    }

    const book = bookResponse.data;
    const isAuthenticated = userService.isAuthenticated();
    const isLiked = isAuthenticated && bookIsLikedResponse.data;
    const isOwner =  isAuthenticated && book._ownerId == userService.getUserId();

    ctx.render(detailsTemplate(book, isAuthenticated, isOwner, isLiked, likesResponse.data, onDeleteButtonClickEventHandler, onLikeButtonClickEventHanlder));

    async function onDeleteButtonClickEventHandler() {
        const choice = confirm('Are you sure you want to delete this book?');

        if(choice) {
            await booksService.delete(bookId);
            ctx.page.redirect('/');
        }
    }

    async function onLikeButtonClickEventHanlder() {
        const payload = {
            bookId
        }

        await likesService.likeBook(payload);
        ctx.page.redirect(`/details/${bookId}`);
    }
};