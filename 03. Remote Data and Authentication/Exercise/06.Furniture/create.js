import furnitureService from './services/furnitureService.js';

window.addEventListener('DOMContentLoaded', () => {
    const createProductFormElement = document.getElementById('create-product');

    createProductFormElement.addEventListener('submit', onCreateProductFormSubmitEventHandler);
});

async function onCreateProductFormSubmitEventHandler(event) {
    event.preventDefault();
    const createProductFormElement = event.target;
    const formData = new FormData(createProductFormElement);

    if(Array.from(formData.entries()).some(([name, value]) => value === '')) {
        alert('All fields are required');
        return
    }

    const name = formData.get('name');
    const price = formData.get('price');
    const factor = formData.get('factor');
    const img = formData.get('img');

    const data = {
        name,
        price,
        factor,
        img
    };

    const result = await furnitureService.create(data);

    if(!result.success) {
        alert(result.data);
        return;
    }

    window.location = '/';
}