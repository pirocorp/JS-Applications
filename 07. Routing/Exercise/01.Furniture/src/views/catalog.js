import furnitureService from '../services/furnitureService.js';
import usersService from '../services/usersService.js';
import { html, until } from '../lib.js';

const catalogTemplate = (dataPromise, userpage) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>${userpage ? 'My Furniture' : 'Welcome to Furniture System'}</h1>
        <p>${userpage ? 'This is a list of your publications.' : 'Select furniture from the catalog to view details.'}</p>
    </div>
</div>
<div class="row space-top">
    ${until(dataPromise, html`<p>Loding &hellip;</p>`)}
</div>`;

const itemTemplate = (item) => html `
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
                <img src=${item.img} />
                <p>${item.description}</p>
                <footer>
                    <p>Price: <span>${item.price} $</span></p>
                </footer>
                <div>
                    <a href=${`/details/${item._id}`} class="btn btn-info">Details</a>
                </div>
        </div>
    </div>
</div>`;

export function catalogPage(ctx) {
    const userpage = ctx.pathname == '/my-furniture'

    ctx.render(catalogTemplate(loadItems(userpage), userpage));
}

async function loadItems(userpage) {
    let response = {}
    
    if(userpage) {
        const userId = usersService.getUserId();
        response = await furnitureService.getByOwnerId(userId);
    } else {
        response = await furnitureService.getAll();
    }

    if(response.success) {
        return response.data.map(itemTemplate);
    }
}