const tbodyElement = document.querySelector('#results tbody');

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('form').addEventListener('submit', onFormSubmitEventHandler);

    loadData();
});

async function onFormSubmitEventHandler(event) {
    event.preventDefault();
    const formElement = event.target;
    const formData = new FormData(formElement);

    if(Array.from(formData.entries()).some(([name, value]) => value === '')) {
        return
    }

    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const facultyNumber = formData.get('facultyNumber');
    const grade = formData.get('grade');

    const data = {
        firstName, 
        lastName,
        facultyNumber,
        grade
    };

    const result = await createDataRow(data);
    tbodyElement.appendChild(createRow(result));
    formElement.reset();
}

async function createDataRow(data) {
    const result = await request('http://localhost:3030/jsonstore/collections/students', {
        method: 'post',
        body: JSON.stringify(data)
    });

    return result;
}

async function loadData() {
    const elements = await request('http://localhost:3030/jsonstore/collections/students');

    const result = Object.values(elements).map((element) => createRow(element));
    tbodyElement.replaceChildren(...result);
}

function createRow(element) {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${element.firstName}</td>
<td>${element.lastName}</td>
<td>${element.facultyNumber}</td>
<td>${element.grade}</td>`;

    return row;
}

async function request(url, options) {
    if (options && options.body != undefined) {
        Object.assign(options, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    const response = await fetch(url, options);

    if (response.ok != true) {
        const error = await response.json();
        alert(error.message);
        throw new Error(error.message);
    }

    const data = await response.json();

    return data;
}