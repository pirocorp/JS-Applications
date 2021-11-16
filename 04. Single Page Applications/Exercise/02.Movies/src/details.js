import moviesService from './services/moviesService.js';
import likesService from './services/likesService.js';
import userService from './services/usersService.js';

import { createDomElement, showView } from "./dom.js";
import { showHome } from './home.js';
import { showEditMovie } from './edit.js';

const section = document.getElementById('movie-details');
section.remove();

export async function showMovieDetails (id) {
    section.replaceChildren(createDomElement('p', {}, 'Loading movie details'))
    showView(section);

    const [movieResponse, likesResponse, isLikedResponse] = await Promise.all([
        moviesService.getById(id),
        likesService.likesPerMovie(id),
        likesService.likePerMoviePerUser(id)
    ]);
    
    if(!movieResponse.success || !likesResponse.success || !isLikedResponse.success) {
        const error = movieResponse.success 
            ? likesResponse.success 
                ? isLikedResponse.data
                : likesResponse.data
            : movieResponse.data;

        alert(error);    
        return
    }
    
    section.replaceChildren(await createMovieDetails(movieResponse.data, likesResponse.data, isLikedResponse.data.length > 0));
}

async function createMovieDetails(movieData, likesCount, isLiked) {
    const likeButton = createDomElement('a', {classList: 'btn btn-primary'}, 'Like');
    likeButton.addEventListener('click', event => onLikeButtonClickHandler.call(null, event, movieData._id, isLiked));

    const movieDetails = createDomElement(
        'div', 
        { classList: 'container' },
        createDomElement(
            'div', 
            { classList: 'row bg-light text-dark' },
            createDomElement('h1', {}, `Movie title: ${movieData.title}`),
            createDomElement(
                'div', 
                { classList: 'col-md-8' },
                createDomElement('img', { classList: 'img-thumbnail', src: movieData.img, alt: movieData.title})
            ),
            createDomElement(
                'div', 
                { id: 'buttons-location', classList: 'col-md-4 text-center' },
                createDomElement('h3', { classList: 'my-3' }, 'Movie Description'),
                createDomElement('p', {}, movieData.description),
            )
        )
    );

    const buttonLocationElement = movieDetails.querySelector('#buttons-location');

    if(userService.isAuthenticated()) {
        if(userService.getUserId() == movieData._ownerId) {
            const deleteButton = createDomElement('a', {classList: 'btn btn-danger'}, 'Delete');
            deleteButton.addEventListener('click', event => onDeleteButtonClickHandler.call(null, event, movieData._id));
    
            const editButton = createDomElement('a', {classList: 'btn btn-warning'}, 'Edit');
            editButton.addEventListener('click', event => onEditButtonClickHandler.call(null, event, movieData._id));

            buttonLocationElement.appendChild(editButton);
            buttonLocationElement.appendChild(deleteButton);
        } else {
            if(isLiked) {
                likeButton.textContent = 'Unlike';
                buttonLocationElement.appendChild(likeButton); 
            } else {
                likeButton.textContent = 'Like';
                buttonLocationElement.appendChild(likeButton); 
            }      
        }
        
        buttonLocationElement.appendChild(createDomElement('span', { classList: 'enrolled-span' }, `Liked ${likesCount}`));
    }

    return movieDetails;
}

async function onDeleteButtonClickHandler(event, movieId) {
    event.preventDefault();

    let response = await moviesService.delete(movieId);

    if(!response.success) {
        alert(response.data);

        return
    }

    showHome();
}

async function onEditButtonClickHandler(event, movieId) {
    event.preventDefault();

    await showEditMovie(movieId);
}

async function onLikeButtonClickHandler(event, movieId, isLiked) {
    event.preventDefault();

    let response;

    if(isLiked) {      
        // This request can be removed if like id is stored in isLiked object but it's overkill 
        response = await likesService.likePerMoviePerUser(movieId);

        if(!response.success) {
            alert(response.data);
        }

        response = await likesService.deleteLike(response.data[0]._id) // response.data[0]._id is like id
    } else {
        response = await likesService.likeMovie(movieId);
    }  

    if(!response.success) {
        alert(response.data);

        return;
    }

    await showMovieDetails(movieId);
}
