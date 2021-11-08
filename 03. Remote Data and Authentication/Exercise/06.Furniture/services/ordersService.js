import requesterService from './requester.js';
import authService from './authService.js';

const endpoint = '/data/orders';

const create = async (data) => {
    const userId = authService.getUserId();    

    if(!Array.isArray(data)) {

        data = [data];
    }

    // Should be executed in parallel 
    return await Promise.all(data.map(async (d) => await createOrder(d, userId)));
};

const getAll = async () => {
    const response = await (requesterService.get(`${endpoint}?select=_ownerId,productId`));

    // server.js where not working, so filtering on client BAD PRACTICE.
    response.data = response.data
        .filter(x => x._ownerId === authService.getUserId())
        .map(x => x.productId);

    return response;
};

async function createOrder(productId, userId) {
    const order = {
        productId : productId,
        userId : userId
    };

    return await requesterService.post(endpoint, order);
}

const furnitureService = {
    create,
    getAll
};

export default furnitureService;

