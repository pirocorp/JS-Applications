import furnitureService from '../services/furnitureService.js';
import { html, until } from '../lib.js';

const editTemplate = (itemPromise) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Edit Furniture</h1>
        <p>Please fill all fields.</p>
    </div>
</div>
${until(itemPromise, html`<p>Loading &hellip;</p>`)}
`;

const formTempate = (item, onSubmit, errorMsg, errors) => html`
<form @submit=${onSubmit}>
    ${errorMsg ? html`<div class="form-group error" style="margin-left:50px;">${errorMsg}</div>` : null}  
    <div class="row space-top">
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-make">Make</label>
                <input class=${'form-control' + (errors.make ? ' is-invalid' : '')} id="new-make" type="text" name="make" .value=${item.make}>
            </div>
            <div class="form-group has-success">
                <label class="form-control-label" for="new-model">Model</label>
                <input class=${'form-control' + (errors.model ? ' is-invalid' : '')} id="new-model" type="text" name="model" .value=${item.model}>
            </div>
            <div class="form-group has-danger">
                <label class="form-control-label" for="new-year">Year</label>
                <input class=${'form-control' + (errors.year ? ' is-invalid' : '')} id="new-year" type="number" name="year" .value=${item.year}>
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-description">Description</label>
                <input class=${'form-control' + (errors.description ? ' is-invalid' : '')} id="new-description" type="text" name="description" .value=${item.description}>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-price">Price</label>
                <input class=${'form-control' + (errors.price ? ' is-invalid' : '')} id="new-price" type="number" name="price" .value=${item.price}>
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-image">Image</label>
                <input class=${'form-control' + (errors.img ? ' is-invalid' : '')} id="new-image" type="text" name="img" .value=${item.img}>
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-material">Material (optional)</label>
                <input class="form-control" id="new-material" type="text" name="material" .value=${item.material}>
            </div>
            <input type="submit" class="btn btn-info" value="Edit" />
        </div>
    </div>
</form>`;

export function editPage(ctx) {
    const itemId = ctx.params.id;
    const itemPromise = furnitureService.getById(itemId);

    update(itemPromise);

    function update(itemPromise, errorMsg, errors = {}) {
        ctx.render(editTemplate(loadItem(itemPromise, errorMsg, errors)));
    }

    async function loadItem(itemPromise, errorMsg, errors) {
        const response = await itemPromise;
    
        return formTempate(response.data, onSubmit, errorMsg, errors);
    }

    async function onSubmit(event) {
        event.preventDefault();

        const data = validateInput(event.target, update);

        if(!data) {
            return
        }

        const response = await furnitureService.edit(itemId, data);

        if(!response.success) {
            update(data, response.data);
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

    data.year = Number(data.year);
    data.price = Number(data.price);

    if(missing.length > 0) {
        const errors = missing.reduce((a, [k]) => Object.assign(a, {[k]: true}), {});
        callback({ data }, 'Please fill all mandatory fields', errors);
        return
    }

    return data
}