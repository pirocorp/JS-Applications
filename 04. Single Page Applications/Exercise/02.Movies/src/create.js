import moviesService from './services/moviesService.js';
import { showView } from './dom.js';
import { showHome } from './home.js';

const submitButtonElement = document.querySelector('#add-movie button');
submitButtonElement.addEventListener('click', onSubmitButtonClickHandler);

const section = document.getElementById('add-movie');
section.remove();

export function showCreateMovie () {
    showView(section);
}

async function onSubmitButtonClickHandler(event) {
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

    const response = await moviesService.create(data);

    if(!response.success){
        alert(response.data);
        return;
    }

    console.log(response);
    await showHome();
}