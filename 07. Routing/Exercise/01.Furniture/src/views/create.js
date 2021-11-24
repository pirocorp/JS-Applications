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
    ${errorMsg ? html`<div class="form-group error" style="margin-left:50px;">${errorMsg}</div>` : null}  
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
    let data = formData.reduce((a, [k, v]) => Object.assign(a, {[k]: v.trim()}) , {});

    const missing = formData.filter(([k, v]) => v.trim() == '' && k != 'material');

    if(missing.length > 0) {
        const errors = missing.reduce((a, [k]) => Object.assign(a, {[k]: true}), {});
        callback('Please fill all mandatory fields', errors);
        return
    }

    data.year = Number(data.year);
    data.price = Number(data.price);

    return data
}