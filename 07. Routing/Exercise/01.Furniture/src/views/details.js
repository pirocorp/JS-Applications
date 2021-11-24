import { html, until } from '../lib.js';
import furnitureService from '../services/furnitureService.js';
import usersService from '../services/usersService.js';

const detailsTemplate = (itemPromise) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Furniture Details</h1>
    </div>
</div>
<div class="row space-top">
    ${until(itemPromise, html`<p>Lodaing &hellip;</p>`)}
</div>`;

const itemTemplate = (item, isOwner, onDelete) => html`
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
            <img src=${item.img} />
        </div>
    </div>
</div>
<div class="col-md-4">
    <p>Make: <span>${item.make}</span></p>
    <p>Model: <span>${item.model}</span></p>
    <p>Year: <span>${item.year}</span></p>
    <p>Description: <span>${item.description}</span></p>
    <p>Price: <span>${item.price}</span></p>
    <p>Material: <span>${item.material}</span></p>
    ${isOwner 
        ? html`
            <div>
                <a href=${`/edit/${item._id}`} class="btn btn-info">Edit</a>
                <a @click=${onDelete} href="javascript:void(0)" class="btn btn-red">Delete</a>
            </div>`
        : null}
</div>`;

export function detailsPage(ctx) {
    ctx.render(detailsTemplate(loadItem(ctx.params.id, onDeleteButtonClickHandler)));

    async function onDeleteButtonClickHandler() {
        const choice = confirm('Are you sure you want to delete this item?');

        if(choice) {
            await furnitureService.delete(ctx.params.id);

            ctx.page.redirect('/');
        }
    }
}

async function loadItem(id, onDelete) {
    const response = await furnitureService.getById(id);

    if(!response.success) {
        return
    }

    const isOwner = usersService.getUserId() == response.data._ownerId;
    
    return itemTemplate(response.data, isOwner, onDelete);
}