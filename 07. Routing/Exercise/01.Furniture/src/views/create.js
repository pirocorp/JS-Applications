import furnitureService from '../services/furnitureService.js';
import { html } from '../lib.js';

const createTemplate = (onSubmit, errorMsg, errors) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Create New Furniture</h1>
        <p>Please fill all fields.</p>
    </div>
</div>
<form @submit=${onSubmit}>
    ${errorMsg ? html`<div class="form-group error" style="margin-left:50px;">${errorMsg.map(e => html`<p>${e}</p>`)}</div>` : null} 
    <div class="row space-top">
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-make">Make</label>
                <input class=${'form-control' + (errors.make ? ' is-invalid' : '')} id="new-make" type="text" name="make">
            </div>
            <div class="form-group has-success">
                <label class="form-control-label" for="new-model">Model</label>
                <input class=${'form-control' + (errors.model ? ' is-invalid' : '')} id="new-model" type="text" name="model">
            </div>
            <div class="form-group has-danger">
                <label class="form-control-label" for="new-year">Year</label>
                <input class=${'form-control' + (errors.year ? ' is-invalid' : '')} id="new-year" type="number" name="year">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-description">Description</label>
                <input class=${'form-control' + (errors.description ? ' is-invalid' : '')} id="new-description" type="text" name="description">
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-price">Price</label>
                <input class=${'form-control' + (errors.price ? ' is-invalid' : '')} id="new-price" type="number" name="price">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-image">Image</label>
                <input class=${'form-control' + (errors.img ? ' is-invalid' : '')} id="new-image" type="text" name="img">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-material">Material (optional)</label>
                <input class="form-control" id="new-material" type="text" name="material">
            </div>
            <input type="submit" class="btn btn-primary" value="Create" />
        </div>
    </div>
</form>`;

export function createPage(ctx) {
    update();

    function update(errorMsg, errors = {}) {
        ctx.render(createTemplate(onCreateFormSubmitHandler, errorMsg, errors));
    }

    async function onCreateFormSubmitHandler(event) {
        event.preventDefault();

        const data = validateInput(event.target, update);

        if(!data) {
            return
        }

        const response = await furnitureService.create(data);

        if(!response.success) {
            update(response.data);
            return;
        }

        event.target.reset();
        ctx.page.redirect(`/details/${response.data._id}`);
    }
} 

function validateInput(target, callback) {
    const formData = [...(new FormData(target)).entries()];
    let input = formData.reduce((a, [k, v]) => Object.assign(a, {[k]: v.trim()}) , {});

    let data = {
        make: input.make,
        model: input.model,
        year: input.year,
        description: input.description,
        price: input.price,
        img: input.img,
        material: input.material,
    }

    let hasError = false;
    const errors = formData.reduce((a, [k]) => Object.assign(a, {[k]: false}), {});
    const errorMsg = [];

    const missing = formData.filter(([k, v]) => v.trim() == '' && k != 'material');

    if(missing.length > 0) {
        missing.reduce((a, [k]) => Object.assign(a, {[k]: true}), errors);
        errorMsg.push('Please fill all mandatory fields');
        hasError = true;
    }

    if(data.make.length < 4) {
        errorMsg.push('Make must be at least 4 symbols long.');
        errors.make = true;        
        hasError = true;
    }

    if(data.model.length < 4) {
        errorMsg.push('Model must be at least 4 symbols long.');
        errors.model = true;        
        hasError = true;
    }

    const year = Number(data.year);

    if(Number.isNaN(year) || year < 1950 || year > 2050) {
        errorMsg.push('Year must be between 1950 and 2050.');
        errors.year = true;        
        hasError = true;
    }

    data.year = year;

    if(data.description.length <= 10) {
        errorMsg.push('Description must be more than 10 symbols.');
        errors.description = true;        
        hasError = true;
    }

    const price = Number(data.price);

    if(Number.isNaN(price) || price <= 0) {
        errorMsg.push('Price must be a positive number.');
        errors.price = true;        
        hasError = true;
    }

    if(hasError) {
        callback(errorMsg, errors);
        return
    }

    data.price = price;

    return data
}