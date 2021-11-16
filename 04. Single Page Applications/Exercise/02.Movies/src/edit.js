import moviesService from "./services/moviesService.js";

import { showView } from "./dom.js";
import { showHome } from "./home.js";

const editButtonElement = document.querySelector('#edit-movie button');

const section = document.getElementById('edit-movie');
section.remove();

export async function showEditMovie (movieId) {
    showView(section);

    const response = await moviesService.getById(movieId);

    if(!response.success){
        alert(response.data);
        return
    }

    const titleElement = section.querySelector('#edit-form-title');
    const descriptionElement = section.querySelector('#edit-form-description');
    const imageUrlElement = section.querySelector('#edit-form-image');

    titleElement.value = response.data.title;
    descriptionElement.value = response.data.description;
    imageUrlElement.value = response.data.img;

    editButtonElement.addEventListener('click', event => onEditButtonClickHandler.call(null, event, movieId));
}

async function onEditButtonClickHandler(event, movieId) {
    event.preventDefault();
    
    const formData = new FormData(section.querySelector('form'));

    const title = formData.get('title');
    const description = formData.get('description');
    const img = formData.get('imageUrl');

    const data = {
        title,
        description,
        img
    }

    const response = await moviesService.update(movieId, data);

    if(!response.success){
        alert(response.data);
        return;
    }

    await showHome();
}