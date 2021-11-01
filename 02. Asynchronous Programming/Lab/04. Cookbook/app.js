if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDocumentLoadedHandler);
} else {
    doOnDocumentLoaded();
}

function onDocumentLoadedHandler () {
    const mainElement = document.querySelector('main');

    const url = `http://localhost:3030/jsonstore/cookbook/recipes`;
    
    fetch(url)
    .then(res => {
        if(res.ok == false) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        return res.json();
    })
    .then(handleResponse) // -> onResolve in promise
    .catch(handleError); // onReject in promise

    function handleResponse(data) {
        mainElement.innerHTML = '';
     
        for (let id in data) {
            const {_id, name, img} = data[id];

            mainElement.appendChild(createRecepiePreview(_id, name, img));
        }
    }
    
    function handleError(error) {
        mainElement.innerHTML = '';
        mainElement.textContent = `${error.message} `;
    }
}

function createRecepiePreview(id, name, img) {
    const recepie = document.createElement('article');
    recepie.classList = "preview";
    recepie.innerHTML = `<div class="title">\n<h2>${name}</h2>\n</div>\n<div class="small">\n<img src="${img}">\n</div>`;

    recepie.addEventListener('click', createRecepie.bind(recepie, id));

    return recepie;
}

function createRecepie(id) {
    const url = `http://localhost:3030/jsonstore/cookbook/details/${id}`;
    this.classList = '';

    fetch(url)
    .then(res => {
        if(res.ok == false) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
    })
    .then(data => {
        const {_id, name, img, steps, ingredients} = data;

        this.innerHTML = `<h2>${name}</h2>
        <div class="band">
            <div class="thumb">
                <img src="${img}">
            </div>
        </div>`;

        const iArr = document.createElement('div');
        iArr.classList = 'ingredients';
        iArr.innerHTML = "<h3>Ingredients:</h3><ul></ul>";

        const ilist = iArr.querySelector('ul');
        for (const ingredient of ingredients) {
            const i = document.createElement('li');
            i.textContent = ingredient;

            ilist.appendChild(i);
        }

        this.querySelector(".band").appendChild(iArr);

        const description = document.createElement('div');
        description.classList = 'description';
        description.innerHTML = '<h3>Preparation:</h3>';

        for (const step of steps) {
            const prep = document.createElement('p');
            prep.textContent = step;

            description.appendChild(prep);
        }

        this.appendChild(description);
    })
    .catch(err => console.log(err)); 
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