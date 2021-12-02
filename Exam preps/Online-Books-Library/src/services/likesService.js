import requesterService from '../api/requester.js';
import { simpleErrorHandler } from '../infrastructure/ui.js';

const endpoint = '/data/likes';

const likeBook = async (data) => requesterService.post(endpoint, data);

const getBookLikes = async (bookId) => requesterService.get(`${endpoint}?where=bookId%3D%22${bookId}%22&distinct=_ownerId&count`);

const bookIsLikedByUser = async (bookId, userId) => requesterService.get(`${endpoint}?where=bookId%3D%22${bookId}%22%20and%20_ownerId%3D%22${userId}%22&count`);

const likesService = {
    likeBook: (data) => simpleErrorHandler(likeBook, data),
    getBookLikes: (bookId) => simpleErrorHandler(getBookLikes, bookId),
    bookIsLikedByUser: (bookId, userId) => simpleErrorHandler(bookIsLikedByUser, bookId, userId)
}

export default likesService;