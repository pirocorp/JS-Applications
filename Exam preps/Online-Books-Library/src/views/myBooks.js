import { html } from '../lib.js';
import booksService from '../services/booksService.js';
import userService from '../services/usersService.js';

const myBooksTemplate = (books) => html`
<section id="my-books-page" class="my-books">
    <h1>My Books</h1>
    <!-- Display ul: with list-items for every user's books (if any) -->
    <ul class="my-books-list">
        ${ books.length == 0 
            ? html`<p class="no-books">No books in database!</p>`
            :  books.map(bookCard) }
    </ul>
</section>`;

const bookCard = (book) => html`
<li class="otherBooks">
    <h3>${book.title}</h3>
    <p>Type: ${book.type}</p>
    <p class="img"><img src=${book.imageUrl}></p>
    <a class="button" href="/details/${book._id}">Details</a>
</li>`;

export async function myBooksPage(ctx) {
    const userId = userService.getUserId();
    const response = await booksService.getByOwnerId(userId);

    if(!response.success) {
        return
    }

    console.log(response);

    ctx.render(myBooksTemplate(response.data));
};