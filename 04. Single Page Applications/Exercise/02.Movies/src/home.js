import movieService from "./services/moviesService.js";

import { createDomElement, showView } from "./dom.js";
import { showCreateMovie } from "./create.js";
import { showMovieDetails } from "./details.js";
import userService from "./services/usersService.js";

const catalog = document.querySelector('.card-deck.d-flex.justify-content-center');
catalog.addEventListener('click', onMovieDetailsClickHandler);

const section = document.getElementById('home-page');

const addMovieButtonElement = section.querySelector('#createLink');
addMovieButtonElement.addEventListener('click', onAddMovieButtonClickHandler);

section.remove();

export async function showHome () {
    showView(section);

    if(!userService.isAuthenticated()) {
        addMovieButtonElement.style.pointerEvents = 'none';
        addMovieButtonElement.style.cursor = 'default';
        addMovieButtonElement.classList = 'btn btn-secondary';
    } else {
        addMovieButtonElement.style.pointerEvents = 'auto';
        addMovieButtonElement.style.cursor = 'pointer';
        addMovieButtonElement.classList = 'btn btn-warning';
    }

    catalog.replaceChildren(createDomElement('p', {}, 'Loading...'));

    const response = await movieService.getAll();

    if(!response.success){
        alert(response.data);
        return
    }

    const movieCards = response.data.map(createMovieCard);
    catalog.replaceChildren(...movieCards);
}

function createMovieCard(movieData) {
    const movieCard = createDomElement(
        'div', 
        { classList: 'card mb-4' },
        createDomElement('img', { src: movieData.img, alt: 'Card image cap' }),
        createDomElement(
            'div', 
            { classList: 'card-body' },
            createDomElement('h4', { classList: 'card-title', }, movieData.title)),
        createDomElement(
            'div',
            { classList: 'card-footer' },
            createDomElement(
                'a', 
                { href: `#`, dataId: movieData._id },
                createDomElement('button', { type: 'button', classList: 'btn btn-info' }, 'Details')
            )
        )
    );

    return movieCard;
}

function onAddMovieButtonClickHandler(event) {
    event.preventDefault();

    showCreateMovie();
};

async function onMovieDetailsClickHandler(event) {
    event.preventDefault();

    let target = event.target;

    if(target.tagName == 'BUTTON') {
        target = target.parentElement;
    }

    if(target.tagName != 'A') {
        return
    }

    const id = target.dataset.id;
    await showMovieDetails(id);
}