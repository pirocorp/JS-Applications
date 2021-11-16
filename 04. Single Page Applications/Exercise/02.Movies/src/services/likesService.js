import requesterService from './requester.js';
import userService from './usersService.js';

const endpoint = '/data/likes';

const likesPerMovie = async (movieId) => requesterService.get(`${endpoint}?where=movieId%3D%22${movieId}%22&distinct=_ownerId&count`);

const likePerMoviePerUser = async (movieId) => requesterService.get(`${endpoint}?where=movieId%3D%22${movieId}%22%20and%20_ownerId%3D%22${userService.getUserId()}%22`);

const likeMovie = async (movieId) => requesterService.post(endpoint, { movieId });

const deleteLike = async (id) => requesterService.del(`${endpoint}/${id}`);

const moviesService = {
    likesPerMovie,
    likePerMoviePerUser,
    likeMovie,
    deleteLike,
};

export default moviesService;