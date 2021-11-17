import ideasService from '../services/ideasService.js';

const section = document.getElementById('create-page')
section.remove();

const createIdeaFormElement = section.querySelector('form');
createIdeaFormElement.addEventListener('submit', onCreateIdeaFormSubmitHandler);

let ctx;

export async function showCreatePage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
}

async function onCreateIdeaFormSubmitHandler(event) {
    event.preventDefault();
    const formData = new FormData(createIdeaFormElement);

    const title = formData.get('title').trim();
    const description = formData.get('description').trim();
    const img = formData.get('imageURL').trim();

    if(!title && title.length < 6) {
        return alert('Title must be at lest 6 characters long');
    }

    if(!description && description.length < 10) {
        return alert('Title must be at lest 10 characters long');
    }

    if(!title && title.length < 5) {
        return alert('Title must be at lest 5 characters long');
    }

    const data = {
        title,
        description,
        img
    };

    const response = await ideasService.create(data);

    if(!response.success) {
        alert(response.data);
        return
    }

    createIdeaFormElement.reset();
    await ctx.goTo('catalog');
}