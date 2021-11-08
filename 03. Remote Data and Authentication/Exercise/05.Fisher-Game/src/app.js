let userData = null;

window.addEventListener('DOMContentLoaded', () => {
    userData = JSON.parse(sessionStorage.getItem('userData'));

    if(userData != null) {
        document.getElementById('guest').style.display = 'none';
        document.querySelector('#addForm .add').disabled = false;
        document.querySelector('header nav p.email span').textContent = userData.email;
    } else {
        document.getElementById('user').style.display = 'none';        
    }

    document.querySelector('.load').addEventListener('click', loadData);
    document.getElementById('addForm').addEventListener('submit', onCreateSubmit);
    document.getElementById('logout').addEventListener('click', onLogoutButtonClickHandler)
    document.getElementById('catches').addEventListener('click', onCatchesElementClickHandler)

    loadData()
});

function onCatchesElementClickHandler(event) {
    if (event.target.className == 'update') {
        onUpdate(event.target);
    } else if (event.target.className == 'delete') {
        onDelete(event.target);
    }
}

async function onDelete(button) {
    if(!userData) {
        window.location = '/login.html'
        return;
    }

    const id = button.dataset.id;

    try {
        const res = await fetch(`http://localhost:3030/data/catches/${id}`);

        if(res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }

        const data = await res.json();

        if(data._ownerId !== userData.id){
            throw new Error('Only owner can delete given resource.')
        }
    } catch (error) {
        alert(error.message);
    }

    try {
        const res = await fetch(`http://localhost:3030/data/catches/${id}`, {
            method: 'delete',
            headers: {
                'X-Authorization': userData.token,
            }
        });

        if(res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }

        loadData();

    } catch (err) {
        alert(err.message);
    }
}

async function onUpdate(button) {
    if(!userData) {
        window.location = '/login.html'
        return;
    }

    const id = button.dataset.id;
    const element = button.parentElement;

    try {
        const res = await fetch(`http://localhost:3030/data/catches/${id}`);

        if(res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }

        const data = await res.json();

        if(data._ownerId !== userData.id){
            throw new Error('Only owner can update given resource.')
        }
    } catch (error) {
        alert(error.message);
    }

    const inputs = Array.from(element.querySelectorAll('input'));

    if(inputs.map(i => i.value).some(x => x == '')) {
        alert('All fields are required');
    }
    
    const data = {
        angler : inputs[0].value,
        weight : inputs[1].value,
        species : inputs[2].value,
        location : inputs[3].value,
        bait : inputs[4].value,
        captureTime : inputs[5].value,
    };

    try {
        const res = await fetch(`http://localhost:3030/data/catches/${id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token,
            },
            body: JSON.stringify(data)
        });

        if(res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }

        loadData();

    } catch (err) {
        alert(err.message);
    }
}

function onLogoutButtonClickHandler() {
    userData = null;
    sessionStorage.clear();

    window.location = '/';
}

async function onCreateSubmit(event) {
    event.preventDefault();

    if(!userData) {
        window.location = '/login.html'
        return;
    }

    const formData = new FormData(event.target);

    const data = [...formData.entries()].reduce((a, [k, v]) => Object.assign(a, {[k]: v}), {});

    try {
        if(Object.values(data).some(x => x == '')) {
            throw new Error('All fields are required');
        }

        const res = await fetch('http://localhost:3030/data/catches/', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': userData.token,
            },
            body: JSON.stringify(data)
        });

        if(res.ok != true) {
            const error = await res.json();
            throw new Error(error.message);
        }

        event.target.reset();
        loadData();

    } catch (err) {
        alert(err.message);
    }
}

async function loadData() {
    const res = await fetch('http://localhost:3030/data/catches/');
    const data = await res.json();

    document.getElementById('catches').replaceChildren(...data.map(createPreview));    
}

function createPreview(item) {
    const isOwner = (userData && item._ownerId == userData.id);

    const element = document.createElement('div');
    element.classList = 'catch';
    element.innerHTML = `<label>Angler</label>
<input type="text" class="angler" value="${item.angler}" ${!isOwner ? 'disabled' : ''}>
<label>Weight</label>
<input type="text" class="weight" value="${item.weight}" ${!isOwner ? 'disabled' : ''}>
<label>Species</label>
<input type="text" class="species" value="${item.species}" ${!isOwner ? 'disabled' : ''}>
<label>Location</label>
<input type="text" class="location" value="${item.location}" ${!isOwner ? 'disabled' : ''}>
<label>Bait</label>
<input type="text" class="bait" value="${item.bait}" ${!isOwner ? 'disabled' : ''}>
<label>Capture Time</label>
<input type="number" class="captureTime" value="${item.captureTime}" ${!isOwner ? 'disabled' : ''}>
<button class="update" data-id="${item._id}" ${!isOwner ? 'disabled' : ''}>Update</button>
<button class="delete" data-id="${item._id}" ${!isOwner ? 'disabled' : ''}>Delete</button>`;

    return element
}