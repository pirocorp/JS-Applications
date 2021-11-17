import usersService from '../services/usersService.js';
import ideasService from '../services/ideasService.js';

import { createDomElement } from '../infrastructure/domUtilities.js';

const section = document.getElementById('details-page')
section.remove();

let ctx;

export async function showDetailsPage(ctxTarget, id) {
    ctx = ctxTarget;
    ctx.showSection(section);

    loadIdea(id);
}

async function loadIdea(id) {
    section.replaceChildren(createDomElement('h1', {}, 'Loading...'))

    const response = await ideasService.getById(id);

    if(!response.success) {
        alert(response.data);
        return;
    }

    section.replaceChildren(createIdeaCard(response.data));
}

function createIdeaCard(ideaData) {
    const fragment = document.createDocumentFragment();

    fragment.appendChild(createDomElement('img', { classList: 'det-img', src: ideaData.img }));

    fragment.appendChild(createDomElement(
        'div', 
        { classList: 'desc' },
        createDomElement('h2', { classList: 'display-5' }, ideaData.title),
        createDomElement('p', { classList: 'infoType'}, 'Description:'),
        createDomElement('p', { classList: 'idea-description'}, ideaData.description),
    ));

    const isVisiable = usersService.isAuthenticated() && usersService.getUserId() === ideaData._ownerId;

    if(isVisiable) {
        const deleteButtonElement = createDomElement(
            'div', 
            { classList: 'text-center'},
            createDomElement('a', { classList:'btn detb', href: '' }, 'Delete')
        );

        deleteButtonElement.addEventListener('click', event => onDeleteButtonClickHandler.call(null, event, ideaData._id));

        fragment.appendChild(deleteButtonElement);
    }

    return fragment;
}

async function onDeleteButtonClickHandler(event, id) {
    event.preventDefault();

    const response = await ideasService.delete(id);

    if(!response.success) {
        alert(response.data);
        return;
    }

    ctx.goTo('catalog');
}