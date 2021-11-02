async function solution() {
    const mainElement = document.getElementById('main');
    
    const response = await fetch('http://localhost:3030/jsonstore/advanced/articles/list');
    const result = await response.json();

    result.forEach(element => {
        const {_id, title} = element;
        mainElement.appendChild(createPreviewElement(_id, title));
    });
}

function createPreviewElement(id, title) {
    const articleButtonElement = createDOMElement('button', {classList: 'button', id: id}, 'More');
    const extraElement = createDOMElement('div', {classList: 'extra'});

    const articleElement = createDOMElement(
        'div',
        {classList: 'accordion'},
        createDOMElement(
            'div', 
            {classList: 'head'},
            createDOMElement('span', {}, title),
            articleButtonElement
        ),
        extraElement
    );

    let isMore = true;
    articleButtonElement.addEventListener('click', onArticleButtonClickHandler.bind(extraElement));
    return articleElement;

    async function onArticleButtonClickHandler(event) {
        const button = event.target;
        const id = button.id;

        const response = await fetch(`http://localhost:3030/jsonstore/advanced/articles/details/${id}`);
        const article = await response.json();
    
        if(isMore) {
            this.appendChild(createDOMElement('p', {}, article.content));
            this.classList = '';
            button.textContent = 'Less';
        } else {
            this.replaceChildren();
            this.classList = 'extra';
            button.textContent = 'More';
        }

        isMore = !isMore;
    }
}



function createDOMElement(type, attr, ...content) {
    const element = document.createElement(type);       

    Object.assign(element, attr);

    for (let item of content) {
        if(typeof(item) === 'string' 
        || typeof(item) === 'number') {
            item = document.createTextNode(item);
        }

        element.appendChild(item);
    }

    return element;
};

solution();