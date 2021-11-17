import requesterService from '../api/requester.js';

const endpoint = '/data/ideas';

const getAll = async () => requesterService.get(`${endpoint}?select=_id%2Ctitle%2Cimg&sortBy=_createdOn%20desc`);

const getById = async (id) => requesterService.get(`${endpoint}/${id}`);

const create = async(data) => requesterService.post(endpoint, data);

const del = async (id) => requesterService.delete(`${endpoint}/${id}`);

const ideasService = {
    getAll,
    getById,
    create,
    delete: del
}

export default ideasService;