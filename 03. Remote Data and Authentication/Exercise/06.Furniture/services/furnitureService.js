import requesterService from './requester.js';

const endpoint = '/data/furniture';

const create = async (data) => requesterService.post(endpoint, data);

const getAll = async () => requesterService.get(endpoint);

const getById = async (id) => requesterService.get(`${endpoint}/${id}`);

const getByIds = async (ids) => Promise.all(ids.map(async (id) => await getById(id)));

const furnitureService = {
    create,
    getAll,
    getById,
    getByIds
};

export default furnitureService;