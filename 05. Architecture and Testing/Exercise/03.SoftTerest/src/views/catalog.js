import { createDomElement } from '../infrastructure/domUtilities.js';
import ideasService from '../services/ideasService.js';

const section = document.getElementById('dashboard-holder')
section.remove();

section.addEventListener('click', onCatalogDetailsClickHandler);

let ctx;

export async function showCatalogPage(ctxTarget) {
    ctx = ctxTarget;
    ctx.showSection(section);
    await loadIdeas();
}

async function loadIdeas() {
    section.replaceChildren(createDomElement('h1', {}, 'Loading...'));

    const response = await ideasService.getAll();

    if(!response.success) {
        alert(response.data);
        return
    }

    if(response.data.length == 0) {
        section.replaceChildren(createDomElement('h1', {}, 'No ideas yet! Be the first one :)'));
    } else {
        const fragment = document.createDocumentFragment();
        response.data.map(createIdeaCard).forEach(i => fragment.appendChild(i));
        
        section.replaceChildren(fragment);
    }    
}

function createIdeaCard(ideaData) {
    const ideaCard = createDomElement(
        'div', 
        {
            classList: 'card overflow-hidden current-card details',
            style: 'width: 20rem; height: 18rem;'
        },
        createDomElement(
            'div', 
            { classList: 'card-body'},
            createDomElement('p', { classList: 'card-text' }, ideaData.title)
        ),
        createDomElement('img', { classList: 'card-image', src: ideaData.img, alt: 'Card image cap'}),
        createDomElement('a', {classList: 'btn', dataId: ideaData._id, href: ''}, 'Details')
    );

    return ideaCard;
}

function onCatalogDetailsClickHandler(event) {
    if(event.target.tagName == 'A') {
        event.preventDefault();

        const id = event.target.dataset.id;
        ctx.goTo('details', id);
    }
}