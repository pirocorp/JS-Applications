import requesterService from '../api/requester.js';
import { simpleErrorHandler } from '../infrastructure/ui.js';

const endpoint = '/data/albums';

const getAll = async () => requesterService.get(`${endpoint}?sortBy=_createdOn%20desc&distinct=name`);

const getById = async (id) => requesterService.get(`${endpoint}/${id}`);

const getByOwnerId = async (userId) => requesterService.get(`${endpoint}?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);

const create = async (data) => requesterService.post(endpoint, data);

const edit = async (id, data) => requesterService.put(`${endpoint}/${id}`, data);

const del = async (id) => requesterService.delete(`${endpoint}/${id}`);

const search = async (query) => requesterService.get(`${endpoint}?where=name%20LIKE%20%22${query}%22`)

const albumsService = {
    getAll: () => simpleErrorHandler(getAll),
    getById: (id) => simpleErrorHandler(getById, id),
    getByOwnerId: (userId) => simpleErrorHandler(getByOwnerId, userId),
    search: (query) => simpleErrorHandler(search, query),
    create: (data) => simpleErrorHandler(create, data),
    edit: (id, data) => simpleErrorHandler(edit, id, data),
    delete: (id) => simpleErrorHandler(del, id)
}

export default albumsService;