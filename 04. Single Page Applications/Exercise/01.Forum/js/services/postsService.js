import requesterService from './requester.js';

const endpoint = '/jsonstore/collections/myboard/posts';

const getAll = async () => requesterService.get(endpoint);

const getById = async (id) => requesterService.get(`${endpoint}/${id}`);

const create = async (data) => requesterService.post(endpoint, data);

const postsService = {
    getAll,
    getById,
    create,
};

export default postsService;