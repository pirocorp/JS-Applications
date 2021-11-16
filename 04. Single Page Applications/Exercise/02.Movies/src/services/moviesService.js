import requesterService from './requester.js';

const endpoint = '/data/movies';

const getAll = async () => requesterService.get(endpoint);

const getById = async (id) => requesterService.get(`${endpoint}/${id}`);

const create = async (data) => requesterService.post(endpoint, data);

const deleteMovie = async (id) => requesterService.del(`${endpoint}/${id}`);

const update = async(id, data) => requesterService.put(`${endpoint}/${id}`, data);

const moviesService = {
    getAll,
    getById,
    create,
    delete: deleteMovie,
    update
};

export default moviesService;